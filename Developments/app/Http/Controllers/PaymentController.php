<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class PaymentController extends Controller
{
    /**
     * GET /api/payments
     * Hỗ trợ: search, pstatus, account_id, course_id, min_amount, max_amount, date_from, date_to,
     *         sort_by, sort_dir, page, per_page
     */
    public function index(Request $req)
    {
        $q = Payment::query();

        // ===== Filters =====
        if ($s = trim((string) $req->input('search', ''))) {
            $q->where(function ($qb) use ($s) {
                $like = "%{$s}%";
                $qb->where('PaymentID', 'like', $like)
                   ->orWhere('AccountID', 'like', $like)
                   ->orWhere('CourseID', 'like', $like)
                   ->orWhere('PStatus', 'like', $like)
                   ->orWhere('TransactionRef', 'like', $like);
            });
        }

        if ($pstatus = $req->input('pstatus')) {
            $q->where('PStatus', $pstatus);
        }
        if ($aid = $req->input('account_id')) {
            $q->where('AccountID', $aid);
        }
        if ($cid = $req->input('course_id')) {
            $q->where('CourseID', $cid);
        }

        if ($req->filled('min_amount') && is_numeric($req->min_amount)) {
            $q->where('Amount', '>=', (float) $req->min_amount);
        }
        if ($req->filled('max_amount') && is_numeric($req->max_amount)) {
            $q->where('Amount', '<=', (float) $req->max_amount);
        }

        // date_from/date_to ở định dạng YYYY-MM-DD; PayDate là DATETIME
        if ($from = $req->input('date_from')) {
            $q->where('PayDate', '>=', "{$from} 00:00:00");
        }
        if ($to = $req->input('date_to')) {
            $q->where('PayDate', '<=', "{$to} 23:59:59");
        }

        // ===== Sorting =====
        $sortBy  = (string) $req->input('sort_by', 'PayDate');
        $sortDir = strtolower((string) $req->input('sort_dir', 'desc')) === 'asc' ? 'asc' : 'desc';
        $allowed = ['PaymentID','AccountID','CourseID','Amount','PayDate','PStatus','TransactionRef'];
        if (!in_array($sortBy, $allowed, true)) {
            $sortBy = 'PayDate';
        }
        $q->orderBy($sortBy, $sortDir);

        // ===== Pagination =====
        $page    = max(1, (int) $req->input('page', 1));
        $perPage = max(1, min(100, (int) $req->input('per_page', 10)));
        $p = $q->paginate($perPage, ['*'], 'page', $page);

        return response()->json([
            'data'          => $p->items(),
            'total'         => $p->total(),
            'per_page'      => $p->perPage(),
            'current_page'  => $p->currentPage(),
            'last_page'     => $p->lastPage(),
            'sort_by'       => $sortBy,
            'sort_dir'      => $sortDir,
        ]);
    }

    /**
     * POST /api/payments
     * Nếu không gửi PaymentID, hệ thống tự sinh dạng P001, P002...
     */
    public function store(Request $req)
    {
        $v = $req->validate([
            'PaymentID'     => ['nullable', 'string', 'max:30', 'unique:payment,PaymentID'],
            'AccountID'     => ['required', 'string', 'max:50'],
            'CourseID'      => ['required', 'string', 'max:50'],
            'Amount'        => ['required', 'numeric', 'min:0'],
            'PayDate'       => ['required', 'date'], // chấp nhận 'YYYY-MM-DD HH:MM:SS' hoặc ISO
            'PStatus'       => ['required', Rule::in(['Paid','Processing','Failed'])],
            'TransactionRef'=> ['nullable', 'string', 'max:100'],
        ]);

        // Nếu không có PaymentID -> tự sinh
        if (empty($v['PaymentID'])) {
            $v['PaymentID'] = $this->nextPaymentCode();
        }

        $created = Payment::create($v);

        return response()->json([
            'message' => 'Created',
            'data'    => $created,
        ], 201);
    }

    /**
     * GET /api/payments/{id}
     */
    public function show($id)
    {
        $row = Payment::where('PaymentID', $id)->firstOrFail();
        return response()->json(['data' => $row]);
    }

    /**
     * PUT/PATCH /api/payments/{id}
     */
    public function update(Request $req, $id)
    {
        $row = Payment::where('PaymentID', $id)->firstOrFail();

        $req->validate([
            'AccountID'      => ['sometimes','required','string','max:50'],
            'CourseID'       => ['sometimes','required','string','max:50'],
            'Amount'         => ['sometimes','required','numeric','min:0'],
            'PayDate'        => ['sometimes','required','date'],
            'PStatus'        => ['sometimes','required', Rule::in(['Paid','Processing','Failed'])],
            'TransactionRef' => ['sometimes','nullable','string','max:100'],
            // KHÔNG cho đổi PaymentID qua update để tránh rắc rối FK
        ]);

        $payload = $req->only(['AccountID','CourseID','Amount','PayDate','PStatus','TransactionRef']);
        $row->fill($payload)->save();

        return response()->json([
            'message' => 'Updated',
            'data'    => $row,
        ]);
    }

    /**
     * DELETE /api/payments/{id}
     */
    public function destroy($id)
    {
        $row = Payment::where('PaymentID', $id)->firstOrFail();
        $row->delete();

        return response()->json(['message' => 'Deleted']);
    }

    /**
     * Sinh mã PaymentID tiếp theo dạng P001, P002...
     * Dựa trên phần số lớn nhất hiện có trong cột PaymentID.
     */
    private function nextPaymentCode(): string
    {
        // Lấy PaymentID lớn nhất theo giá trị số ở đuôi
        $last = Payment::query()
            ->select('PaymentID')
            ->orderByRaw("LPAD(REGEXP_REPLACE(PaymentID, '[^0-9]', ''), 10, '0') DESC")
            ->first();

        $n = 0;
        if ($last && preg_match('/(\d+)/', $last->PaymentID, $m)) {
            $n = (int) $m[1];
        }
        $n += 1;

        // Zero-pad 3 chữ số (đổi 3 -> 5 nếu bạn muốn nhiều hơn)
        return 'P' . str_pad((string) $n, 3, '0', STR_PAD_LEFT);
    }
}
