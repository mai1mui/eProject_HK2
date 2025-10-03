<?php

namespace App\Http\Controllers;

use App\Models\Feedback;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class FeedbackController extends Controller
{
    /**
     * GET /api/feedback
     * Query params:
     *  - search   : chuỗi tìm Content/FeedbackID/AccountID
     *  - user     : AccountID
     *  - status   : Waiting|Processed
     *  - rating   : 1..5   (alias: rate)
     *  - reply    : with|none (có/không có AdminReply)
     *  - page     : trang (mặc định 1)
     *  - per_page : số dòng/trang (mặc định 10, tối đa 100)
     */
    public function index(Request $request)
    {
        $q = Feedback::query()->with('account');

        // search (group OR)
        if ($search = trim((string) $request->query('search', ''))) {
            $q->where(function ($qq) use ($search) {
                $qq->where('Content', 'like', "%{$search}%")
                   ->orWhere('FeedbackID', 'like', "%{$search}%")
                   ->orWhere('AccountID', 'like', "%{$search}%");
            });
        }

        // filter theo user/account
        if ($user = trim((string) $request->query('user', ''))) {
            $q->where('AccountID', $user);
        }

        // filter theo rating (accept 'rating' hoặc 'rate')
        $rating = $request->query('rating', $request->query('rate', null));
        if ($rating !== null && $rating !== '' && is_numeric($rating)) {
            $q->where('Rate', (int) $rating);
        }

        // filter theo status
        if ($status = trim((string) $request->query('status', ''))) {
            $q->where('FStatus', $status);
        }

        // NEW: filter theo reply (with|none)
        $reply = $request->query('reply', null);
        if ($reply === 'with') {
            $q->whereNotNull('AdminReply')->whereRaw("TRIM(AdminReply) <> ''");
        } elseif ($reply === 'none') {
            $q->where(function ($qq) {
                $qq->whereNull('AdminReply')
                   ->orWhereRaw("TRIM(AdminReply) = ''");
            });
        }

        // sort mặc định: mới nhất trước
        $q->orderByDesc('CreatedAt')
          ->orderBy('FeedbackID'); // phụ để ổn định thứ tự

        // paginate (luôn trả meta cho FE)
        $per  = max(1, min(100, (int) $request->query('per_page', 10)));
        $page = max(1, (int) $request->query('page', 1));
        $p = $q->paginate($per, ['*'], 'page', $page);

        return response()->json([
            'data'     => $p->items(),
            'total'    => $p->total(),
            'per_page' => $p->perPage(),
            'page'     => $p->currentPage(),
        ]);
    }

    /**
     * GET /api/feedback/{id}
     * id là FeedbackID (vd: F001)
     */
    public function show($id)
    {
        $fb = Feedback::with('account')->where('FeedbackID', $id)->first();
        if (!$fb) {
            return response()->json(['message' => 'Feedback not found'], 404);
        }
        return response()->json(['data' => $fb]);
    }

    /**
     * POST /api/feedback
     * Body:
     *  - FeedbackID (optional, auto-generate if missing)
     *  - AccountID  (required, exists:accounts)
     *  - Content    (required)
     *  - Rate       (nullable 1..5)
     *  - FStatus    (default Waiting)
     *  - AdminReply (nullable)
     *  - CreatedAt  (optional datetime; default now())
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'FeedbackID' => 'sometimes|string|unique:feedback,FeedbackID',
            'AccountID'  => 'required|string|exists:accounts,AccountID',
            'Content'    => 'required|string',
            'Rate'       => 'nullable|integer|min:1|max:5',
            'FStatus'    => 'nullable|in:Processed,Waiting',
            'AdminReply' => 'nullable|string',
            'CreatedAt'  => 'sometimes|date',
        ]);

        // Auto-generate FeedbackID nếu không gửi
        $feedbackId = $validated['FeedbackID'] ?? $this->nextFeedbackId();

        $data = [
            'FeedbackID' => $feedbackId,
            'AccountID'  => $validated['AccountID'],
            'Content'    => $validated['Content'],
            'FStatus'    => $validated['FStatus'] ?? 'Waiting',
            'AdminReply' => $validated['AdminReply'] ?? null,
            'CreatedAt'  => $validated['CreatedAt'] ?? now(),
        ];

        if (array_key_exists('Rate', $validated) && $validated['Rate'] !== null && $validated['Rate'] !== '') {
            $data['Rate'] = (int) $validated['Rate'];
        }

        $fb = Feedback::create($data);

        return response()->json([
            'message'  => 'Feedback created',
            'feedback' => $fb,
        ], 201);
    }

    /**
     * PUT /api/feedback/{id}
     * id là FeedbackID
     */
    public function update(Request $request, $id)
    {
        $fb = Feedback::where('FeedbackID', $id)->first();
        if (!$fb) {
            return response()->json(['message' => 'Feedback not found'], 404);
        }

        $validated = $request->validate([
            'AccountID'  => 'sometimes|string|exists:accounts,AccountID',
            'Content'    => 'sometimes|string',
            'Rate'       => 'sometimes|nullable|integer|min:1|max:5',
            'FStatus'    => 'sometimes|in:Processed,Waiting',
            'AdminReply' => 'sometimes|nullable|string',
            'CreatedAt'  => 'sometimes|date',
            // Không cho đổi FeedbackID để tránh xung đột khóa
        ]);

        $update = [];
        foreach (['AccountID', 'Content', 'FStatus', 'AdminReply', 'CreatedAt'] as $f) {
            if ($request->has($f)) {
                $update[$f] = $validated[$f] ?? null;
            }
        }
        if ($request->has('Rate')) {
            $update['Rate'] = $validated['Rate'] ?? null;
        }

        if (empty($update)) {
            return response()->json(['message' => 'No valid field to update'], 422);
        }

        $fb->update($update);

        return response()->json([
            'message'  => 'Feedback updated',
            'feedback' => $fb->fresh('account'),
        ]);
    }

    /**
     * DELETE /api/feedback/{id}
     * id là FeedbackID
     */
    public function destroy($id)
    {
        $fb = Feedback::where('FeedbackID', $id)->first();
        if (!$fb) {
            return response()->json(['message' => 'Feedback not found'], 404);
        }

        $fb->delete();
        return response()->json(['message' => 'Feedback deleted']);
    }

    /**
     * Sinh FeedbackID tiếp theo dạng F001, F002...
     */
    private function nextFeedbackId(): string
    {
        // Lấy FeedbackID có số lớn nhất theo tiền tố 'F'
        $last = DB::table('feedback')
            ->where('FeedbackID', 'LIKE', 'F%')
            ->orderByRaw("CAST(SUBSTRING(FeedbackID, 2) AS UNSIGNED) DESC")
            ->value('FeedbackID');

        $num = $last ? ((int) preg_replace('/\D+/', '', $last)) + 1 : 1;
        return 'F' . str_pad((string) $num, 3, '0', STR_PAD_LEFT);
    }
}
