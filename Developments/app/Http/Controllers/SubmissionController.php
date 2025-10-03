<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class SubmissionController extends Controller
{
    /* Helper: tạo URL tuyệt đối từ đường dẫn trong disk public */
    private function fileUrl(?string $path): ?string
    {
        return $path ? asset('storage/' . ltrim($path, '/')) : null;
    }

    /* ===== LIST ===== */
    public function index(Request $request)
    {
        $per      = (int) $request->query('per_page', 10);
        $search   = trim((string) $request->query('search', ''));
        $status   = $request->query('status');
        $role     = $request->query('role');
        $approval = $request->query('approval');

        $q = DB::table('submissions as s')
            ->leftJoin('accounts as a', 'a.AccountID', '=', 's.AccountID')
            ->select(
                's.SubID','s.AccountID','s.CourseID','s.Answer','s.Mark','s.Feedback','s.SDate','s.SStatus',
                DB::raw('a.ARole as ARole'),
                DB::raw('a.ApprovalStatus as ApprovalStatus')
            )
            ->when($status !== null && $status !== '', fn($qq) => $qq->where('s.SStatus', $status))
            ->when($role !== null && $role !== '', fn($qq) => $qq->where('a.ARole', $role))
            ->when($approval !== null && $approval !== '', fn($qq) => $qq->where('a.ApprovalStatus', $approval))
            ->when($search !== '', function ($qq) use ($search) {
                $s = '%' . str_replace('%', '\%', $search) . '%';
                $qq->where(function ($w) use ($s) {
                    $w->where('s.SubID', 'LIKE', $s)
                      ->orWhere('s.AccountID', 'LIKE', $s)
                      ->orWhere('s.CourseID', 'LIKE', $s)
                      ->orWhere('s.Feedback', 'LIKE', $s);
                });
            })
            ->orderByRaw("REGEXP_SUBSTR(s.SubID, '^[A-Za-z]+') ASC")
            ->orderByRaw("CAST(REGEXP_SUBSTR(s.SubID, '[0-9]+$') AS UNSIGNED) ASC");

        $p = $q->paginate($per);

        $items = collect($p->items())->map(function ($r) {
            $r->AnswerUrl = $this->fileUrl($r->Answer);
            return $r;
        })->all();

        return response()->json([
            'data'      => $items,
            'total'     => $p->total(),
            'per_page'  => $p->perPage(),
            'page'      => $p->currentPage(),
        ]);
    }

    /* ===== SHOW ONE ===== */
    public function show($id)
    {
        $r = DB::table('submissions')->where('SubID', $id)->first();
        if (!$r) {
            return response()->json(['message' => 'Submission not found'], 404);
        }
        $r->AnswerUrl = $this->fileUrl($r->Answer);

        return response()->json(['data' => $r]);
    }

    /* ===== CREATE ===== */
    public function store(Request $request)
    {
        $request->validate([
            'SubID'     => 'nullable|string|unique:submissions,SubID',
            'AccountID' => 'required|string',
            'CourseID'  => 'required|string',
            'Answer'    => 'nullable|file|max:10240', // 10MB
            'Mark'      => 'nullable|numeric',
            'Feedback'  => 'nullable|string',
            'SDate'     => 'nullable|date',
            'SStatus'   => 'nullable|in:Submitted,Late',
        ]);

        $path = null;
        if ($request->hasFile('Answer')) {
            // ✅ LƯU VÀO storage/app/public/submissions
            $path = $request->file('Answer')->store('submissions', 'public');
        }

        // Nếu không truyền SubID, có thể tự sinh (ví dụ: S + số)
        $subId = $request->input('SubID');
        if (!$subId) {
            $last = DB::table('submissions')
                ->select('SubID')
                ->orderByRaw("CAST(REGEXP_SUBSTR(SubID, '[0-9]+$') AS UNSIGNED) DESC")
                ->value('SubID');
            $nextNum = $last ? (int)preg_replace('/\D+/', '', $last) + 1 : 1;
            $subId = 'S' . str_pad($nextNum, 3, '0', STR_PAD_LEFT);
        }

        DB::table('submissions')->insert([
            'SubID'     => $subId,
            'AccountID' => $request->input('AccountID'),
            'CourseID'  => $request->input('CourseID'),
            'Answer'    => $path, // ví dụ "submissions/answer01.pdf"
            'Mark'      => $request->input('Mark'),
            'Feedback'  => $request->input('Feedback'),
            'SDate'     => $request->input('SDate'),
            'SStatus'   => $request->input('SStatus', 'Submitted'),
        ]);

        return response()->json([
            'message'   => 'Created',
            'data'      => [
                'SubID'     => $subId,
                'Answer'    => $path,
                'AnswerUrl' => $this->fileUrl($path),
            ],
        ], 201);
    }

    /* ===== UPDATE ===== */
    public function update(Request $request, $id)
    {
        $request->validate([
            'SubID'     => 'sometimes|string|unique:submissions,SubID,' . $id . ',SubID',
            'AccountID' => 'sometimes|string',
            'CourseID'  => 'sometimes|string',
            'Answer'    => 'sometimes|file|max:10240',
            'Mark'      => 'sometimes|nullable|numeric',
            'Feedback'  => 'sometimes|nullable|string',
            'SDate'     => 'sometimes|nullable|date',
            'SStatus'   => 'sometimes|in:Submitted,Late',
        ]);

        $row = DB::table('submissions')->where('SubID', $id)->first();
        if (!$row) {
            return response()->json(['message' => 'Submission not found'], 404);
        }

        $data = [];
        foreach (['SubID','AccountID','CourseID','Mark','Feedback','SDate','SStatus'] as $f) {
            if ($request->has($f)) $data[$f] = $request->input($f);
        }

        // ✅ Nếu có file mới → xóa file cũ (nếu tồn tại) rồi lưu vào submissions/
        if ($request->hasFile('Answer')) {
            if ($row->Answer && Storage::disk('public')->exists($row->Answer)) {
                Storage::disk('public')->delete($row->Answer);
            }
            $newPath = $request->file('Answer')->store('submissions', 'public');
            $data['Answer'] = $newPath;
        }

        if (empty($data)) {
            return response()->json(['message' => 'No valid field to update'], 400);
        }

        DB::table('submissions')->where('SubID', $id)->update($data);

        // Lấy record mới để trả URL
        $fresh = DB::table('submissions')->where('SubID', $data['SubID'] ?? $id)->first();
        $fresh->AnswerUrl = $this->fileUrl($fresh->Answer);

        return response()->json([
            'message' => 'Updated',
            'data'    => $fresh,
        ]);
    }

    /* ===== DELETE ===== */
    public function destroy($id)
    {
        $row = DB::table('submissions')->where('SubID', $id)->first();
        if (!$row) {
            return response()->json(['message' => 'Submission not found'], 404);
        }

        if ($row->Answer && Storage::disk('public')->exists($row->Answer)) {
            Storage::disk('public')->delete($row->Answer);
        }

        DB::table('submissions')->where('SubID', $id)->delete();

        return response()->json(['message' => 'Deleted']);
    }

    /* (Tùy chọn) DOWNLOAD qua header Content-Disposition */
    public function download($id)
    {
        $row = DB::table('submissions')->where('SubID', $id)->first();
        if (!$row || !$row->Answer) {
            return response()->json(['message' => 'File not found'], 404);
        }
        $path = ltrim($row->Answer, '/');
        if (!Storage::disk('public')->exists($path)) {
            return response()->json(['message' => 'File missing on server'], 404);
        }
        return Storage::disk('public')->download($path, basename($path));
    }
}
