<?php

namespace App\Http\Controllers;

use App\Models\Enrollment;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class EnrollmentController extends Controller
{
    // Lấy danh sách enrollment + filter
    public function index(Request $request)
    {
        $query = Enrollment::with(['learner', 'course']);

        // Search (theo learner name hoặc course name)
        if ($request->has('search') && $request->search != '') {
            $search = $request->search;
            $query->whereHas('learner', function($q) use ($search) {
                $q->where('AName', 'like', "%$search%");
            })->orWhereHas('course', function($q) use ($search) {
                $q->where('CName', 'like', "%$search%");
            });
        }

        // Filter learner
        if ($request->has('learner') && $request->learner != '') {
            $query->where('AccountID', $request->learner);
        }

        // Filter course
        if ($request->has('course') && $request->course != '') {
            $query->where('CourseID', $request->course);
        }

        // Filter status
        if ($request->has('status') && $request->status != '') {
            $query->where('EStatus', $request->status);
        }

        $enrollments = $query->get()->map(function($enr) {
            return [
                'EnrollmentID' => $enr->EnrollmentID,
                'LearnerName'  => $enr->learner->AName ?? null,
                'CourseName'   => $enr->course->CName ?? null,
                'AccountID'    => $enr->AccountID,
                'CourseID'     => $enr->CourseID,
                'EnrollDate'   => $enr->EnrollDate,
                'EStatus'      => $enr->EStatus,
            ];
        });

        return response()->json($enrollments);
    }

    // Thêm mới
    public function store(Request $request)
    {
        $request->validate([
            'AccountID' => 'required',
            'CourseID' => 'required',
            'EnrollDate' => 'required|date',
            'EStatus' => 'required',
        ]);

        $id = 'ENR' . str_pad(rand(1, 9999), 4, '0', STR_PAD_LEFT);

        $enrollment = Enrollment::create([
            'EnrollmentID' => $id,
            'AccountID' => $request->AccountID,
            'CourseID' => $request->CourseID,
            'EnrollDate' => $request->EnrollDate,
            'EStatus' => $request->EStatus,
        ]);

        return response()->json($enrollment, 201);
    }

    // Cập nhật
    public function update(Request $request, $id)
    {
        $enrollment = Enrollment::findOrFail($id);

        $enrollment->update($request->all());

        return response()->json($enrollment);
    }

    // Xóa
    public function destroy($id)
    {
        $enrollment = Enrollment::findOrFail($id);
        $enrollment->delete();

        return response()->json(['message' => 'Deleted successfully']);
    }
}
