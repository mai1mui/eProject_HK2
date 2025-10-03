<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Lesson;
use Carbon\Carbon;

class LessonController extends Controller
{
    /**
     * GET /api/lessons
     * Query:
     *  - search (LessonID/LName/Content, LIKE)
     *  - course (CourseID)
     *  - type   (LessonType)
     *  - status (LStatus)
     *  - page, per_page
     */
    public function index(Request $req)
    {
        $per   = (int) $req->query('per_page', 10);
        $page  = (int) $req->query('page', 1);

        $search = trim((string) $req->query('search', ''));
        $course = $req->query('course');
        $type   = $req->query('type');
        $status = $req->query('status');

        $q = Lesson::query()
            ->select(['LessonID','CourseID','LName','Content','LessonType','Ordinal','LStatus','CreatedAt'])
            ->orderBy('CourseID')->orderBy('Ordinal');

        if ($search !== '') {
            $q->where(function ($w) use ($search) {
                $w->where('LessonID', 'LIKE', "%{$search}%")
                  ->orWhere('LName',   'LIKE', "%{$search}%")
                  ->orWhere('Content', 'LIKE', "%{$search}%");
            });
        }
        if ($course !== null && $course !== '') {
            $q->where('CourseID', $course);
        }
        if ($type !== null && $type !== '') {
            $q->where('LessonType', $type);
        }
        if ($status !== null && $status !== '') {
            $q->where('LStatus', $status);
        }

        $p = $q->paginate($per, ['*'], 'page', $page);

        $items = collect($p->items())->map(function ($r) {
            // luôn xuất ISO-8601, kể cả khi DB trả dạng string
            $created = $r->CreatedAt
                ? ($r->CreatedAt instanceof \DateTimeInterface
                    ? $r->CreatedAt->toIso8601String()
                    : Carbon::parse($r->CreatedAt)->toIso8601String())
                : null;

            return [
                'LessonID'   => $r->LessonID,
                'CourseID'   => $r->CourseID,
                'LName'      => $r->LName,
                'Content'    => $r->Content,
                'LessonType' => $r->LessonType,
                'Ordinal'    => (int)$r->Ordinal,
                'LStatus'    => $r->LStatus,
                'CreatedAt'  => $created,
                'created_at' => $created, // alias cho FE
            ];
        });

        return response()->json([
            'data'         => $items,
            'total'        => $p->total(),
            'per_page'     => $p->perPage(),
            'current_page' => $p->currentPage(),
        ]);
    }

    /**
     * POST /api/lessons
     */
    public function store(Request $req)
    {
        $data = $req->validate([
            'LessonID'   => 'required|string|max:20|unique:lessons,LessonID',
            'CourseID'   => 'required|string|exists:courses,CourseID',
            'LName'      => 'required|string|max:255',
            'Content'    => 'nullable|string|max:500',
            'LessonType' => 'required|string|in:Video,Quiz,Assignment,Doc,Document,Other',
            'Ordinal'    => 'nullable|integer|min:0',
            'LStatus'    => 'nullable|string|max:50',
        ]);

        $data['Ordinal'] = $data['Ordinal'] ?? 0;

        $lesson = Lesson::create($data);

        return response()->json($lesson, 201);
    }

    /**
     * PUT /api/lessons/{id}  // id = LessonID
     */
    public function update(Request $req, $id)
    {
        $lesson = Lesson::where('LessonID', $id)->firstOrFail();

        $data = $req->validate([
            'CourseID'   => 'sometimes|required|string|exists:courses,CourseID',
            'LName'      => 'sometimes|required|string|max:255',
            'Content'    => 'nullable|string|max:500',
            'LessonType' => 'nullable|string|in:Video,Quiz,Assignment,Doc,Document,Other',
            'Ordinal'    => 'nullable|integer|min:0',
            'LStatus'    => 'nullable|string|max:50',
        ]);

        $lesson->update($data);

        return response()->json($lesson);
    }

    /**
     * DELETE /api/lessons/{id}
     */
    public function destroy($id)
    {
        $deleted = Lesson::where('LessonID', $id)->delete();
        return response()->json(['ok' => true, 'deleted' => (bool) $deleted]);
    }
}
