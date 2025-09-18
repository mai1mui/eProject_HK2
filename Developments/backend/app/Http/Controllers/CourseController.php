<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CourseController extends Controller
{
    // GET: /api/courses
    public function index(Request $request)
    {
        $query = DB::table('courses');

        if ($request->has('search')) {
            $query->where('CName', 'like', '%' . $request->search . '%');
        }

        if ($request->has('creator') && $request->creator != '') {
            $query->where('CreatorID', $request->creator);
        }

        if ($request->has('status') && $request->status != '') {
            $query->where('CStatus', $request->status);
        }

        return response()->json($query->get());
    }

    // GET: /api/courses/{id}
    public function show($id)
    {
        $course = DB::table('courses')->where('CourseID', $id)->first();

        if (!$course) {
            return response()->json(['message' => 'Course not found'], 404);
        }

        $lessons = DB::table('lessons')->where('CourseID', $id)->get();

        return response()->json([
            'course' => $course,
            'lessons' => $lessons
        ]);
    }

    // POST: /api/courses
    public function store(Request $request)
    {
        $id = uniqid('C'); // Tạo CourseID ngẫu nhiên

        DB::table('courses')->insert([
            'CourseID' => $id,
            'CName' => $request->input('CName'),
            'CDescription' => $request->input('CDescription'),
            'StartDate' => $request->input('StartDate'),
            'CreatorID' => $request->input('CreatorID'),
            'CStatus' => $request->input('CStatus', 'active'),
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return response()->json(['message' => 'Course created', 'CourseID' => $id], 201);
    }

    // PUT: /api/courses/{id}
    public function update(Request $request, $id)
    {
        $updated = DB::table('courses')
            ->where('CourseID', $id)
            ->update([
                'CName' => $request->input('CName'),
                'CDescription' => $request->input('CDescription'),
                'StartDate' => $request->input('StartDate'),
                'CreatorID' => $request->input('CreatorID'),
                'CStatus' => $request->input('CStatus'),
                'updated_at' => now(),
            ]);

        if ($updated) {
            return response()->json(['message' => 'Course updated']);
        } else {
            return response()->json(['message' => 'Course not found'], 404);
        }
    }

    // DELETE: /api/courses/{id}
    public function destroy($id)
    {
        $deleted = DB::table('courses')->where('CourseID', $id)->delete();

        if ($deleted) {
            return response()->json(['message' => 'Course deleted']);
        } else {
            return response()->json(['message' => 'Course not found'], 404);
        }
    }
}
