<?php

namespace App\Http\Controllers;

use App\Models\Result;
use Illuminate\Http\Request;

class ResultController extends Controller
{
    // GET /api/results
    public function index()
    {
        $results = Result::all();
        return response()->json($results);
    }

    // GET /api/results/{id}
    public function show($id)
    {
        $result = Result::findOrFail($id);
        return response()->json($result);
    }

    // POST /api/results
    public function store(Request $request)
    {
        $request->validate([
            'ResultID' => 'required|string|unique:results,ResultID',
            'LearnerName' => 'required|string',
            'CourseID' => 'required|string',
            'ExamName' => 'required|string',
            'Score' => 'required|numeric|min:0',
            'RStatus' => 'required|in:Passed,Failed,Pending',
        ]);

        $result = Result::create($request->all());

        return response()->json([
            'message' => 'Result created successfully',
            'result' => $result
        ], 201);
    }

    // PUT /api/results/{id}
    public function update(Request $request, $id)
    {
        $result = Result::findOrFail($id);

        $request->validate([
            'LearnerName' => 'sometimes|string',
            'CourseID' => 'sometimes|string',
            'ExamName' => 'sometimes|string',
            'Score' => 'sometimes|numeric|min:0',
            'RStatus' => 'sometimes|in:Passed,Failed,Pending',
        ]);

        $result->update($request->all());

        return response()->json([
            'message' => 'Result updated successfully',
            'result' => $result
        ]);
    }

    // DELETE /api/results/{id}
    public function destroy($id)
    {
        $result = Result::findOrFail($id);
        $result->delete();

        return response()->json(['message' => 'Result deleted successfully']);
    }
}
