<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\Account;

class AdminListController extends Controller
{
    // GET /api/admin/list/payments?per_page=5
    public function payments(Request $req)
    {
        $per = max(1, min((int) $req->query('per_page', 5), 50));

        $rows = DB::table('payment as p')
            ->leftJoin('accounts as a', 'a.AccountID', '=', 'p.AccountID')
            ->leftJoin('courses  as c', 'c.CourseID',  '=', 'p.CourseID')
            ->orderByDesc('p.PayDate')
            ->limit($per)
            ->get([
                'p.PaymentID',
                'p.Amount',
                'p.PayDate',
                'p.PStatus as Status',
                'a.AName   as Payer',
                'c.CName   as Course',
            ]);

        $data = $rows->map(function ($r) {
            return [
                'PaymentID' => $r->PaymentID,
                'Payer'     => $r->Payer ?? '—',
                'Course'    => $r->Course ?? '—',
                'Amount'    => (float) $r->Amount,
                'Status'    => (string) ($r->Status ?? ''),
                'PayDate'   => (string) ($r->PayDate ?? ''),
            ];
        })->values();

        return response()->json(['data' => $data], 200);
    }

    // GET /api/admin/list/courses?per_page=5&sort=top|latest
    public function courses(Request $req)
    {
        $per  = max(1, min((int) $req->query('per_page', 5), 50));
        $sort = $req->query('sort', 'top');

        $q = DB::table('courses as c')
            ->leftJoin('enrollments as e', 'e.CourseID', '=', 'c.CourseID')
            ->selectRaw('c.CourseID, c.CName, COUNT(e.EnrollmentID) as student_count')
            ->groupBy('c.CourseID', 'c.CName');

        if ($sort === 'latest') {
            $q->orderByDesc('c.CreatedAt');
        } else {
            $q->orderByDesc('student_count');
        }

        $rows = $q->limit($per)->get();

        $data = $rows->map(function ($c) {
            return [
                'CourseID'      => $c->CourseID,
                'Title'         => $c->CName,
                'student_count' => (int) ($c->student_count ?? 0),
            ];
        })->values();

        return response()->json(['data' => $data], 200);
    }

    // GET /api/admin/list/accounts?per_page=4
   public function accounts(Request $req)
{
    $per = max(1, min((int) $req->query('per_page', 4), 50));

    $rows = Account::query()
        ->orderByDesc('CreatedAt')
        ->limit($per)
        ->get(['AccountID','AName','ARole','AStatus','Email','CreatedAt','Avatar']);

    $data = $rows->map(fn($u) => [
        'AccountID' => $u->AccountID,
        'FullName'  => $u->AName,
        'Role'      => $u->ARole,
        'Status'    => $u->AStatus,
        'Email'     => $u->Email,
        'CreatedAt' => $u->CreatedAt,
        'AvatarUrl' => $u->Avatar,
    ]);

    return response()->json(['data' => $data], 200);
}
   public function topInstructors(Request $req)
{
    $per = max(1, min((int) $req->query('per_page', 3), 20));

    // Chỉ tính instructor có course; đếm số course và số học viên (enrollments)
    // - Liên kết: accounts(ARole='Instructor') -> courses.CreatorID
    // - Học viên: enrollments.CourseID = courses.CourseID
    // - Chỉ tính enrollments không bị Cancel (tùy bạn: có thể giới hạn 'Paid' nếu muốn)
    $rows = \DB::table('accounts as a')
        ->join('courses as c', 'c.CreatorID', '=', 'a.AccountID')
        ->leftJoin('enrollments as e', function ($j) {
            $j->on('e.CourseID', '=', 'c.CourseID')
              ->whereNotIn('e.EStatus', ['Paid']); 
        })
        ->where('a.ARole', '=', 'Instructor')
        ->groupBy('a.AccountID', 'a.AName', 'a.Avatar')
        ->selectRaw('
            a.AccountID,
            a.AName,
            a.Avatar,
            COUNT(DISTINCT c.CourseID)     as courses_count,
            COUNT(DISTINCT e.AccountID)    as students_count
        ')
        ->orderByDesc('students_count')
        ->orderByDesc('courses_count')
        ->limit($per)
        ->get();

    // Chuẩn hoá JSON cho FE
    $data = $rows->map(function ($r, $idx) {
        return [
            'rank'           => $idx + 1,
            'AccountID'      => $r->AccountID,
            'Name'           => $r->AName,
            'AvatarUrl'      => $r->Avatar ? asset('storage/' . $r->Avatar) : asset('storage/avatars/avatar.jpg'),
            'courses_count'  => (int) $r->courses_count,
            'students_count' => (int) $r->students_count,
            'profile_url'    => url('/admin/accounts/' . $r->AccountID), // hoặc route bạn dùng
        ];
    });

    return response()->json(['data' => $data], 200);
}
}
