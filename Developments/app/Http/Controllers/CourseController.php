<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CourseController extends Controller
{
    // Lấy danh sách courses
    public function index()
    {
        $courses = DB::table('courses')
            ->select('CourseID', 'CName', 'CDescription', 'StartDate', 'CStatus', 'CreatorID')
            ->get();

        return response()->json($courses);
    }

    // Thêm mới course
    public function store(Request $request)
    {
        $validated = $request->validate([
            'CName'        => 'required|string|max:255',
            'CDescription' => 'nullable|string',
        ]);

        // Lấy CourseID cuối cùng có prefix ADM
        $last = DB::table('courses')
            ->where('CourseID', 'like', 'ADM%')
            ->orderBy('CourseID', 'desc')
            ->first();

        if ($last) {
            $num = intval(substr($last->CourseID, 3)) + 1;
            $newId = 'ADM' . str_pad($num, 5, '0', STR_PAD_LEFT);
        } else {
            $newId = 'ADM00001';
        }

        DB::table('courses')->insert([
            'CourseID'     => $newId,
            'CName'        => $validated['CName'],
            'CDescription' => $validated['CDescription'] ?? '',
            'StartDate'    => now(),
            'CStatus'      => 'Inactive',
            'CreatorID'    => 'INS003', // ⚠️ demo fix cứng, sau này nên lấy từ auth user
        ]);

        return response()->json([
            'message'  => 'Course added successfully',
            'CourseID' => $newId
        ]);
    }

    // Cập nhật course
    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'CName'        => 'nullable|string|max:255',
            'CDescription' => 'nullable|string',
            'CStatus'      => 'nullable|in:Active,Inactive,Archived',
        ]);

        $affected = DB::table('courses')
            ->where('CourseID', $id)
            ->update(array_filter($validated, fn($v) => !is_null($v)));

        if ($affected) {
            return response()->json(['message' => 'Course updated successfully']);
        }

        return response()->json(['message' => 'Course not found or unchanged'], 404);
    }

    // Xoá course
    public function destroy($id)
    {
        $deleted = DB::table('courses')->where('CourseID', $id)->delete();

        if ($deleted) {
            return response()->json(['message' => 'Course deleted successfully']);
        }

        return response()->json(['message' => 'Course not found'], 404);
    }
}
