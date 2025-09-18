<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class LessonController extends Controller
{
    // GET /api/courses/{id}/lessons
    public function index($id)
    {
        return response()->json(
            DB::table('lessons')->where('CourseID', $id)->get()
        );
    }

    // POST /api/lessons
    public function store(Request $request)
    {
        $id = uniqid('L');
        DB::table('lessons')->insert([
            'LessonID' => $id,
            'CourseID' => $request->input('CourseID'),
            'LName' => $request->input('LName'),
            'LContent' => $request->input('LContent'),
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return response()->json(['message' => 'Lesson created', 'LessonID' => $id], 201);
    }

    // PUT /api/lessons/{id}
    public function update(Request $request, $id)
    {
        $updated = DB::table('lessons')
            ->where('LessonID', $id)
            ->update([
                'LName' => $request->input('LName'),
                'LContent' => $request->input('LContent'),
                'updated_at' => now(),
            ]);

        return $updated
            ? response()->json(['message' => 'Lesson updated'])
            : response()->json(['message' => 'Lesson not found'], 404);
    }

    // DELETE /api/lessons/{id}
    public function destroy($id)
    {
        $deleted = DB::table('lessons')->where('LessonID', $id)->delete();

        return $deleted
            ? response()->json(['message' => 'Lesson deleted'])
            : response()->json(['message' => 'Lesson not found'], 404);
    }
}
