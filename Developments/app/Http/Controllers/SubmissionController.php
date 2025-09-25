<?php

namespace App\Http\Controllers;

use App\Models\Submission;
use Illuminate\Http\Request;

class SubmissionController extends Controller
{
    // GET /api/submissions
    public function index(Request $request)
    {
        $query = Submission::query()
            ->with(['account', 'course']); // load quan hệ để lấy tên learner & course

        // Search theo Answer hoặc Feedback
        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('Answer', 'like', "%$search%")
                  ->orWhere('Feedback', 'like', "%$search%");
            });
        }

        // Filter theo Course
        if ($course = $request->input('course')) {
            $query->where('CourseID', $course);
        }

        // Filter theo Status
        if ($status = $request->input('status')) {
            $query->where('SStatus', $status);
        }

        return response()->json($query->get());
    }

    // POST /api/submissions
    public function store(Request $request)
    {
        $request->validate([
            'SubID' => 'required|string|unique:submissions,SubID',
            'AccountID' => 'required|string|exists:accounts,AccountID',
            'CourseID' => 'required|string|exists:courses,CourseID',
            'Answer' => 'nullable|string',
            'Mark' => 'nullable|numeric',
            'Feedback' => 'nullable|string',
            'SStatus' => 'required|in:Submitted,Late,Not Submit',
        ]);

        $submission = Submission::create($request->all());

        return response()->json(['message' => 'Submission created', 'submission' => $submission], 201);
    }

    // PUT /api/submissions/{id}
    public function update(Request $request, $id)
    {
        $submission = Submission::findOrFail($id);

        $request->validate([
            'AccountID' => 'sometimes|string|exists:accounts,AccountID',
            'CourseID' => 'sometimes|string|exists:courses,CourseID',
            'Answer' => 'nullable|string',
            'Mark' => 'nullable|numeric',
            'Feedback' => 'nullable|string',
            'SStatus' => 'required|in:Submitted,Late,Not Submit',
        ]);

        $submission->update($request->all());

        return response()->json(['message' => 'Submission updated', 'submission' => $submission]);
    }

    // DELETE /api/submissions/{id}
    public function destroy($id)
    {
        $submission = Submission::findOrFail($id);
        $submission->delete();

        return response()->json(['message' => 'Submission deleted']);
    }
}
