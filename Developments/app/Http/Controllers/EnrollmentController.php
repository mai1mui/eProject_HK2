<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Notification;
use App\Models\Enrollment;
use App\Models\CourseAccess;

class EnrollmentController extends Controller
{
    // GET /api/enrollments
    public function index(Request $req)
    {
        $per   = (int) $req->query('per_page', 10);
        $page  = (int) $req->query('page', 1);

        $search  = trim((string) $req->query('search', ''));
        $course  = $req->query('course');
        $account = $req->query('account');
        $status  = $req->query('status');

        $q = Enrollment::query()
            ->select(['EnrollmentID','AccountID','CourseID','EnrollDate','EStatus'])
            ->orderBy('EnrollDate', 'desc');

        if ($search !== '') {
            $q->where(function ($w) use ($search) {
                $w->where('EnrollmentID', 'LIKE', "%{$search}%")
                  ->orWhere('AccountID',   'LIKE', "%{$search}%")
                  ->orWhere('CourseID',    'LIKE', "%{$search}%");
            });
        }
        if ($course)  $q->where('CourseID', $course);
        if ($account) $q->where('AccountID', $account);
        if ($status)  $q->where('EStatus', $status);

        $p = $q->paginate($per, ['*'], 'page', $page);

        return response()->json([
            'data'         => $p->items(),
            'total'        => $p->total(),
            'per_page'     => $p->perPage(),
            'current_page' => $p->currentPage(),
        ]);
    }

    // POST /api/enrollments
    public function store(Request $req)
    {
        $data = $req->validate([
            'EnrollmentID' => 'required|string|max:20|unique:enrollments,EnrollmentID',
            'AccountID'    => 'required|string|max:50', // optionally: exists:accounts,AccountID
            'CourseID'     => 'required|string|max:50', // optionally: exists:courses,CourseID
            'EnrollDate'   => 'nullable|date',
            'EStatus'      => 'nullable|string|in:Paid,Processing,Not Confirmed,Refunded,Canceled',
        ]);

        $row = Enrollment::create($data);

        return response()->json($row, 201);
    }

    // PUT /api/enrollments/{id}
    public function update(Request $req, $id)
    {
        // abort_unless($req->user()?->ARole === 'Admin', 403);

        $enr = Enrollment::findOrFail($id);

        $data = $req->validate([
            'AccountID'  => 'sometimes|required|string|max:50',
            'CourseID'   => 'sometimes|required|string|max:50',
            'EnrollDate' => 'nullable|date',
            'EStatus'    => 'nullable|string|in:Paid,Processing,Not Confirmed,Refunded,Canceled',
        ]);

        $oldStatus  = $enr->EStatus;
        $oldCourse  = $enr->CourseID;
        $oldAccount = $enr->AccountID;

        DB::transaction(function () use ($enr, $data, $oldStatus, $oldCourse, $oldAccount) {
            // 1) Cập nhật enrollment
            $enr->fill($data);
            $enr->save();

            $newStatus = $enr->EStatus;
            $accountId = $enr->AccountID;
            $courseId  = $enr->CourseID;

            // 2) Nếu đổi AccountID/CourseID → đồng bộ quyền
            if ($oldAccount !== $accountId || $oldCourse !== $courseId) {
                // Thu hồi quyền cũ (nếu có)
                if ($oldAccount && $oldCourse) {
                    CourseAccess::where('AccountID', $oldAccount)
                        ->where('CourseID',  $oldCourse)
                        ->delete();
                }
                // Nếu trạng thái hiện tại là Paid → cấp quyền mới
                if ($newStatus === Enrollment::STATUS_PAID) {
                    CourseAccess::firstOrCreate(
                        ['AccountID' => $accountId, 'CourseID' => $courseId],
                        ['GrantedAt' => now()]
                    );
                }
            }

            // 3) Chuyển sang Paid (từ trạng thái khác) → CẤP QUYỀN
            $toPaid = ($newStatus === Enrollment::STATUS_PAID && $oldStatus !== Enrollment::STATUS_PAID);
            if ($toPaid) {
                CourseAccess::firstOrCreate(
                    ['AccountID' => $accountId, 'CourseID' => $courseId],
                    ['GrantedAt' => now()]
                );

                // Gửi mail (nếu đã tạo notification & user model)
                if (class_exists(\App\Models\User::class) && class_exists(\App\Notifications\EnrollmentPaid::class)) {
                    $user = \App\Models\User::where('AccountID', $accountId)->first();
                    if ($user) {
                        Notification::send($user, new \App\Notifications\EnrollmentPaid($enr));
                    }
                }

                // Ghi log
                if (class_exists(\App\Models\ActivityLog::class)) {
                    \App\Models\ActivityLog::create([
                        'AccountID' => $accountId,
                        'action'    => 'enrollment.paid',
                        'meta'      => json_encode([
                            'EnrollmentID' => $enr->EnrollmentID,
                            'CourseID'     => $courseId,
                            'from'         => $oldStatus,
                            'to'           => Enrollment::STATUS_PAID,
                        ], JSON_UNESCAPED_UNICODE),
                    ]);
                }
            }

            // 4) Chuyển sang Refunded/Canceled → THU HỒI QUYỀN
            $toRevoked = in_array($newStatus, [Enrollment::STATUS_REFUNDED, Enrollment::STATUS_CANCELED], true)
                         && $oldStatus !== $newStatus;
            if ($toRevoked) {
                CourseAccess::where('AccountID', $accountId)
                    ->where('CourseID',  $courseId)
                    ->delete();

                // Gửi mail thu hồi (nếu đã tạo notification)
                if (class_exists(\App\Models\User::class) && class_exists(\App\Notifications\EnrollmentRevoked::class)) {
                    $user = \App\Models\User::where('AccountID', $accountId)->first();
                    if ($user) {
                        Notification::send($user, new \App\Notifications\EnrollmentRevoked($enr));
                    }
                }

                // Ghi log
                if (class_exists(\App\Models\ActivityLog::class)) {
                    \App\Models\ActivityLog::create([
                        'AccountID' => $accountId,
                        'action'    => 'enrollment.revoked',
                        'meta'      => json_encode([
                            'EnrollmentID' => $enr->EnrollmentID,
                            'CourseID'     => $courseId,
                            'from'         => $oldStatus,
                            'to'           => $newStatus,
                        ], JSON_UNESCAPED_UNICODE),
                    ]);
                }
            }
        });

        return response()->json($enr->fresh());
    }

    // DELETE /api/enrollments/{id}
    public function destroy($id)
    {
        $deleted = Enrollment::where('EnrollmentID', $id)->delete();
        return response()->json(['ok' => true, 'deleted' => (bool) $deleted]);
    }
}
