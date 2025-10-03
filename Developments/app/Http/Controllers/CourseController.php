<?php

namespace App\Http\Controllers;

use App\Models\Course;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;      // <— THÊM DÒNG NÀY
use Illuminate\Support\Facades\Schema;  // <— (khuyến nghị) nếu bạn dùng Schema::hasTable()

class CourseController extends Controller
{
    public function index(Request $req)
    {
        $per   = (int) $req->query('per_page', 10);
        $page  = (int) $req->query('page', 1);
        $q     = trim((string) $req->query('search', ''));
        $stat  = $req->query('status');   // Active/Inactive
        $cre   = $req->query('creator');  // CreatorID

        $builder = Course::query()
            ->select([
                'CourseID','CName','CDescription','StartDate','CreatorID','CStatus','CreatedAt',
            ])
            ->orderBy('CourseID');

        if ($q !== '') {
            $builder->where(function ($w) use ($q) {
                $w->where('CourseID','LIKE',"%$q%")
                  ->orWhere('CName','LIKE',"%$q%")
                  ->orWhere('CDescription','LIKE',"%$q%");
            });
        }
        if ($stat !== null && $stat !== '') {
            $builder->where('CStatus', $stat);
        }
        if ($cre !== null && $cre !== '') {
            $builder->where('CreatorID', $cre);
        }

        $p = $builder->paginate($per, ['*'], 'page', $page);

        // Chuẩn hoá payload: có cả CreatedAt và created_at
        $items = collect($p->items())->map(function ($c) {
            return [
                'CourseID'     => $c->CourseID,
                'CName'        => $c->CName,
                'CDescription' => $c->CDescription,
                'StartDate'    => optional($c->StartDate)->format('Y-m-d'),
                'CreatorID'    => $c->CreatorID,
                'CStatus'      => $c->CStatus,
                'CreatedAt'    => optional($c->CreatedAt)->toIso8601String(),
                'created_at'   => optional($c->CreatedAt)->toIso8601String(), // alias cho FE
            ];
        });

        return response()->json([
            'data'         => $items,
            'total'        => $p->total(),
            'per_page'     => $p->perPage(),
            'current_page' => $p->currentPage(),
        ]);
    }

    public function store(Request $req)
    {
        $data = $req->validate([
            'CourseID'     => 'required|string|max:20|unique:courses,CourseID',
            'CName'        => 'required|string|max:255',
            'CDescription' => 'nullable|string',
            'StartDate'    => 'nullable|date',
            'CreatorID'    => 'nullable|string|max:20',
            'CStatus'      => 'required|string|in:Active,Inactive',
        ]);

        $course = Course::create($data); // CreatedAt sẽ tự set nếu DB mặc định CURRENT_TIMESTAMP
        return response()->json($course, 201);
    }

    public function update(Request $req, $id)
    {
        $course = Course::findOrFail($id);
        $data = $req->validate([
            'CName'        => 'sometimes|required|string|max:255',
            'CDescription' => 'nullable|string',
            'StartDate'    => 'nullable|date',
            'CreatorID'    => 'nullable|string|max:20',
            'CStatus'      => 'nullable|string|in:Active,Inactive',
        ]);
        $course->update($data);
        return response()->json($course);
    }

    public function destroy($id)
    {
        Course::where('CourseID',$id)->delete();
        return response()->json(['ok' => true]);
    }
public function publicIndex(Request $r)
{
    $q     = trim((string) $r->query('q', ''));
    $sort  = $r->query('sort', 'newest'); // newest | rating | popular
    $page  = max(1, (int) $r->query('page', 1));
    $per   = max(1, min(12, (int) $r->query('per_page', 12)));

    $base = DB::table('courses as c')
        ->leftJoin('accounts as a', 'a.AccountID', '=', 'c.CreatorID')

        // Ảnh bìa (lấy 1 url/khóa học để không vướng ONLY_FULL_GROUP_BY)
        ->leftJoin(DB::raw("
            (SELECT ModelID AS CourseID, MIN(url) AS url
             FROM media
             WHERE Model='course' AND Type='cover'
             GROUP BY ModelID) as cv
        "), 'cv.CourseID', '=', 'c.CourseID')

        // rating trung bình + số lượt đánh giá
        ->leftJoin(DB::raw("
            (SELECT CourseID,
                    ROUND(AVG(Rate),1) AS rating_avg,
                    COUNT(*)           AS rating_count
             FROM feedback
             GROUP BY CourseID) as rt
        "), 'rt.CourseID', '=', 'c.CourseID')

        // số học viên đã thanh toán
        ->leftJoin(DB::raw("
            (SELECT CourseID, COUNT(*) AS students_count
             FROM enrollments
             WHERE EStatus='Paid'
             GROUP BY CourseID) as st
        "), 'st.CourseID', '=', 'c.CourseID')

        ->when($q !== '', function ($qq) use ($q) {
            $qq->where(function ($w) use ($q) {
                $w->where('c.CName', 'like', "%{$q}%")
                  ->orWhere('c.CDescription', 'like', "%{$q}%");
            });
        })
        ->where('c.CStatus', 'Active')
        ->selectRaw("
            c.CourseID,
            c.CName,
            c.CDescription,
            a.AName                                  as InstructorName,
            COALESCE(cv.url,'')                      as cover_url,
            COALESCE(rt.rating_avg,0)                as rating_avg,
            COALESCE(rt.rating_count,0)              as rating_count,
            COALESCE(st.students_count,0)            as students_count
        ");

    // sort
    $base = match ($sort) {
        'rating'  => $base->orderByDesc('rt.rating_avg')->orderBy('c.CName'),
        'popular' => $base->orderByDesc('st.students_count')->orderBy('c.CName'),
        default   => $base->orderByDesc('c.CreatedAt'),
    };

    $p = $base->paginate($per, ['*'], 'page', $page);

    return response()->json([
        'items'     => $p->items(),
        'total'     => $p->total(),
        'page'      => $p->currentPage(),
        'per_page'  => $p->perPage(),
    ]);
}
}

