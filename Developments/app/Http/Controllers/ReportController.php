<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ReportController extends Controller
{
    /* ================= Helpers ================= */

    private function rangeBounds(?string $range): array
    {
        $r = strtolower((string)$range);
        switch ($r) {
            case 'today':
                return [now()->startOfDay(), now()->endOfDay()];
            case 'this_week':
            case 'week':
                return [now()->startOfWeek(), now()->endOfWeek()->endOfDay()];
            case 'this_month':
            case 'month':
                return [now()->startOfMonth(), now()->endOfMonth()->endOfDay()];
            case 'quarter':
                return [now()->firstOfQuarter()->startOfDay(), now()->lastOfQuarter()->endOfDay()];
            case 'this_year':
            case 'year':
                return [now()->startOfYear(), now()->endOfYear()->endOfDay()];
            default:
                return [null, null];
        }
    }

    /* ================= Endpoints ================= */

    // GET /api/reports/summary?currency=VND
    public function summary(Request $request)
    {
        $currency = $request->query('currency', 'VND');

        // Đếm user, course
        $userCount   = (int) DB::table('accounts')->count();
        $courseCount = (int) DB::table('courses')->count();

        // Doanh thu tháng hiện tại: bảng THỰC TẾ là `payment` (số ít)
        $startMonth = now()->startOfMonth();
        $endMonth   = now()->endOfMonth()->endOfDay();

        $revenue = (float) DB::table('payment')  // <-- đúng tên bảng
            ->whereBetween('PayDate', [$startMonth, $endMonth]) // đúng tên cột ngày
            ->sum(DB::raw('COALESCE(`Amount`,0)'));             // đúng tên cột tiền

        // Tỉ lệ hoàn tất: số feedback Processed / tổng feedback
        $totalFb = (int) DB::table('feedback')->count();
        $processedFb = (int) DB::table('feedback')->where('FStatus', 'Processed')->count();
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
        [$start, $end] = $this->rangeBounds($request->query('range', 'week'));
        if (!$start || !$end) { [$start, $end] = $this->rangeBounds('week'); }

        // bảng enrollments dùng cột EnrollDate
        $rows = DB::table('enrollments')
            ->select(DB::raw('DATE(`EnrollDate`) as d'), DB::raw('COUNT(*) as total'))
            ->whereBetween('EnrollDate', [$start, $end])
            ->groupBy(DB::raw('DATE(`EnrollDate`)'))
            ->orderBy('d')
            ->get()
            ->pluck('total', 'd');

        $labels = [];
        $counts = [];
        $cur = $start->clone();
        while ($cur <= $end) {
            $k = $cur->toDateString();
            $labels[] = $cur->format('n/j');
            $counts[] = (int)($rows[$k] ?? 0);
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

    // GET /api/reports/latest-users?limit=8&range=...
    public function latestUsers(Request $request)
    {
        $limit = (int) $request->query('limit', 8);
        [$from, $to] = $this->rangeBounds($request->query('range'));

        // bảng accounts dùng cột CreatedAt
        $q = DB::table('accounts')
            ->select('AccountID','AName','ARole','AStatus','CreatedAt');

        if ($from && $to) {
            $q->whereBetween('CreatedAt', [$from, $to]);
        }

        $rows = $q->orderBy('CreatedAt', 'DESC')
            ->limit($limit)
            ->get();

        return response()->json($rows);
    }
}
