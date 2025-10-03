<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;  
use Carbon\Carbon;                  // <- nếu cần dùng (Laravel có sẵn Carbon trong now())
use Carbon\CarbonPeriod;
use App\Models\Payment;


class ReportDashboardController extends Controller
{
    /* ================= Helpers ================= */

    /**
     * Trả về cột thời gian hợp lệ cho 1 bảng.
     * Ưu tiên theo thứ tự trong $preferred; nếu không có thì thử CreatedAt, created_at.
     */
    private function timeCol(string $table, array $preferred): string
    {
        foreach ($preferred as $col) {
            if (Schema::hasColumn($table, $col)) return $col;
        }
        if (Schema::hasColumn($table, 'CreatedAt')) return 'CreatedAt';
        if (Schema::hasColumn($table, 'created_at')) return 'created_at';
        // Nếu thực sự không có cột thời gian, vẫn trả về ưu tiên đầu để tránh rỗng
        // (nhưng nên thêm cột thời gian trong DB).
        return $preferred[0] ?? 'CreatedAt';
    }

    /**
     * Chuẩn hoá khoảng thời gian.
     * Hỗ trợ: today | this_week | this_month | quarter | this_year | week | month | year
     */
    private function rangeBounds(?string $range): array
    {
        $r = strtolower((string) $range);

        switch ($r) {
            case 'today':
                $from = now()->startOfDay();
                $to   = now()->endOfDay();
                break;

            case 'this_week':
            case 'week':
                $from = now()->startOfWeek();
                $to   = now()->endOfWeek()->endOfDay();
                break;

            case 'this_month':
            case 'month':
                $from = now()->startOfMonth();
                $to   = now()->endOfMonth()->endOfDay();
                break;

            case 'quarter':
                $from = now()->firstOfQuarter()->startOfDay();
                $to   = now()->lastOfQuarter()->endOfDay();
                break;

            case 'this_year':
            case 'year':
                $from = now()->startOfYear();
                $to   = now()->endOfYear()->endOfDay();
                break;

            default:
                $from = null;
                $to   = null;
        }

        return [$from, $to];
    }

    /* ================= Endpoints ================= */

    // GET /api/reports/summary?currency=VND
    public function summary(Request $request)
    {
        $currency = $request->query('currency', 'VND');

        // Đếm user, course
        $userCount   = (int) DB::table('accounts')->count();
        $courseCount = (int) DB::table('courses')->count();

        // Doanh thu tháng hiện tại theo bảng payments
        // Ưu tiên PayDate; fallback CreatedAt/created_at nếu PayDate không có
        $payDateCol = $this->timeCol('payments', ['PayDate']);
        $startMonth = now()->startOfMonth();
        $endMonth   = now()->endOfMonth()->endOfDay();

        $revenue = (float) DB::table('payments')
            ->when(
                Schema::hasColumn('payments', $payDateCol),
                fn($q) => $q->whereBetween($payDateCol, [$startMonth, $endMonth]),
                fn($q) => $q // nếu không có cột thời gian, thôi không whereBetween để tránh lỗi
            )
            ->sum(DB::raw("COALESCE(`Amount`,`amount`,0)"));

        // Tỉ lệ complete = số feedback Processed / tổng feedback
        $totalFb = (int) DB::table('feedback')->count();
        $processedFb = (int) DB::table('feedback')
            ->where('FStatus', 'Processed')
            ->count();
        $completePct = $totalFb > 0 ? round($processedFb * 100 / $totalFb) : 0;

        return response()->json([
            'userCount'    => $userCount,
            'courseCount'  => $courseCount,
            'revenueMonth' => $revenue,
            'currency'     => $currency,
            'completePct'  => $completePct,
            'period'       => [
                'from' => $startMonth->toIso8601String(),
                'to'   => $endMonth->toIso8601String(),
            ],
        ]);
    }

    // GET /api/reports/students-per-course
    public function studentsPerCourse()
    {
        $rows = DB::table('enrollments')
            ->select('CourseID', DB::raw('COUNT(*) as total'))
            ->groupBy('CourseID')
            ->orderByDesc('total')
            ->limit(12)
            ->get();

        return response()->json($rows);
    }

    // GET /api/reports/registrations-series?range=today|this_week|this_month|quarter|this_year
    public function registrationsSeries(Request $request)
    {
        // Bảng enrollments ưu tiên EnrollDate; fallback CreatedAt/created_at
        $enrollDateCol = $this->timeCol('enrollments', ['EnrollDate']);

        [$start, $end] = $this->rangeBounds($request->query('range', 'week'));
        if (!$start || !$end) {
            [$start, $end] = $this->rangeBounds('week');
        }

        $rows = DB::table('enrollments')
            ->select(
                DB::raw("DATE(`{$enrollDateCol}`) as d"),
                DB::raw("COUNT(*) as total")
            )
            ->when(
                Schema::hasColumn('enrollments', $enrollDateCol),
                fn($q) => $q->whereBetween($enrollDateCol, [$start, $end]),
                fn($q) => $q
            )
            ->groupBy(DB::raw("DATE(`{$enrollDateCol}`)"))
            ->orderBy('d')
            ->get()
            ->pluck('total', 'd');

        // build dãy đủ ngày cho FE
        $labels = [];
        $counts = [];
        $cur = $start->clone();
        while ($cur <= $end) {
            $k = $cur->toDateString();
            $labels[] = $cur->format('n/j');
            $counts[] = (int) ($rows[$k] ?? 0);
            $cur->addDay();
        }

        return response()->json(['labels' => $labels, 'counts' => $counts]);
    }

    // GET /api/reports/roles-pie
    public function rolesPie()
    {
        $rows = DB::table('accounts')
            ->select('ARole', DB::raw('COUNT(*) as total'))
            ->groupBy('ARole')
            ->get();

        return response()->json(
            $rows->map(fn($r) => ['name' => $r->ARole, 'value' => (int)$r->total])
        );
    }

    // GET /api/reports/latest-users?limit=8&range=today|this_week|this_month|this_year
    public function latestUsers(Request $request)
    {
        $limit = (int) $request->query('limit', 8);
        [$from, $to] = $this->rangeBounds($request->query('range'));

        // Bảng accounts: bạn yêu cầu dùng đúng CreatedAt
        $timeCol = 'CreatedAt';
        // nếu DB lỡ đặt khác, fallback để không 500
        if (!Schema::hasColumn('accounts', $timeCol)) {
            $timeCol = $this->timeCol('accounts', ['CreatedAt']);
        }

        $q = DB::table('accounts')
            ->select('AccountID','AName','ARole','AStatus', DB::raw("`{$timeCol}` as CreatedAt"));

        if ($from && $to && Schema::hasColumn('accounts', $timeCol)) {
            $q->whereBetween($timeCol, [$from, $to]);
        }

        $rows = $q->orderBy($timeCol, 'DESC')
            ->limit($limit)
            ->get();

        return response()->json($rows);
    }
   public function revenueSeries(Request $req)
    {
        $range = $req->query('range', '7d');         // 7d | 30d | 12m
        $gran  = $req->query('granularity');         // day | month (optional)
        if (!$gran) {
            $gran = ($range === '12m') ? 'month' : 'day';
        }

        $end = Carbon::now();
        if ($gran === 'month') {
            // 12 tháng gần nhất
            $start = (clone $end)->startOfMonth()->subMonths(11);
            // Lấy tổng Amount theo tháng, chỉ tính PStatus = 'Paid'
            $rows = Payment::query()
                ->selectRaw("DATE_FORMAT(PayDate, '%Y-%m') as ym, SUM(Amount) as total")
                ->where('PStatus', 'Paid')
                ->whereBetween('PayDate', [$start, $end])
                ->groupBy('ym')
                ->orderBy('ym')
                ->get();

            // build map ym => total
            $map = $rows->keyBy('ym')->map->total;

            // fill đủ 12 tháng (kể cả tháng không có
            $labels = [];
            $series = [];
            $period = CarbonPeriod::create($start, '1 month', $end);
            foreach ($period as $d) {
                $ym = $d->format('Y-m');
                $labels[] = $d->format('M Y');           // ví dụ: Sep 2025
                $series[] = (float) ($map[$ym] ?? 0);
            }

            return response()->json(compact('series', 'labels'));
        }

        // Mặc định: theo ngày (7 hoặc 30 ngày gần nhất)
        $days = ($range === '30d') ? 30 : 7;
        $start = (clone $end)->startOfDay()->subDays($days - 1);

        $rows = Payment::query()
            ->selectRaw("DATE(PayDate) as d, SUM(Amount) as total")
            ->where('PStatus', 'Paid')
            ->whereBetween('PayDate', [$start, $end])
            ->groupBy('d')
            ->orderBy('d')
            ->get();

        $map = $rows->keyBy('d')->map->total;

        $labels = [];
        $series = [];
        $period = CarbonPeriod::create($start, '1 day', $end);
        foreach ($period as $d) {
            $key = $d->format('Y-m-d');
            $labels[] = $d->format('n/j');              // ví dụ: 9/8
            $series[] = (float) ($map[$key] ?? 0);
        }

        return response()->json(compact('series', 'labels'));
    }

}
