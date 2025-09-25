<?php

namespace App\Http\Controllers;

use App\Models\Feedback;
use Illuminate\Http\Request;

class FeedbackController extends Controller
{
    // GET /api/feedback
    public function index(Request $request)
    {
        $query = Feedback::query()->with('account');

        if ($search = $request->input('search')) {
            $query->where('Content', 'like', "%$search%")
                  ->orWhere('FeedbackID', 'like', "%$search%")
                  ->orWhere('AccountID', 'like', "%$search%");
        }

        if ($user = $request->input('user')) {
            $query->where('AccountID', $user);
        }

        if ($rating = $request->input('rating')) {
            $query->where('Rate', $rating);
        }

        if ($status = $request->input('status')) {
            $query->where('FStatus', $status);
        }

        return response()->json($query->get());
    }

    // GET /api/feedback/{id}
    public function show($id)
    {
        $feedback = Feedback::with('account')->findOrFail($id);
        return response()->json($feedback);
    }

    // POST /api/feedback
    public function store(Request $request)
    {
        $request->validate([
            'FeedbackID' => 'required|string|unique:feedback,FeedbackID',
            'AccountID' => 'required|string|exists:accounts,AccountID',
            'Content' => 'required|string',
            'Rate' => 'required|integer|min:1|max:5',
            'FStatus' => 'required|in:Processed,Waiting',
            'AdminReply' => 'nullable|string',
        ]);

        $feedback = Feedback::create($request->all());

        return response()->json(['message' => 'Feedback created', 'feedback' => $feedback], 201);
    }

    // PUT /api/feedback/{id}
    public function update(Request $request, $id)
    {
        $feedback = Feedback::findOrFail($id);

        $request->validate([
            'Content' => 'sometimes|string',
            'Rate' => 'sometimes|integer|min:1|max:5',
            'FStatus' => 'sometimes|in:Processed,Waiting',
            'AdminReply' => 'nullable|string',
        ]);

        $feedback->update($request->all());

        return response()->json(['message' => 'Feedback updated', 'feedback' => $feedback]);
    }

    // DELETE /api/feedback/{id}
    public function destroy($id)
    {
        $feedback = Feedback::findOrFail($id);
        $feedback->delete();

        return response()->json(['message' => 'Feedback deleted']);
    }
}
