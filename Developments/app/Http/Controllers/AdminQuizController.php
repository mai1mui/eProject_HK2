<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use App\Models\Lesson;

class AdminQuizController extends Controller
{
    // POST /api/admin/quizzes
    // Body: { LessonID: "L006", questions: [ {id, question, options:[], answerIndex} ] }
    public function store(Request $req)
    {
        $data = $req->validate([
            'LessonID'  => 'required|string|exists:lessons,LessonID',
            'questions' => 'required|array|min:1',
            'questions.*.id'           => 'nullable|integer',
            'questions.*.question'     => 'required|string',
            'questions.*.options'      => 'required|array|min:2',
            'questions.*.options.*'    => 'required|string',
            'questions.*.answerIndex'  => 'required|integer|min:0',
        ]);

        // đảm bảo answerIndex nằm trong range options
        foreach ($data['questions'] as $i => $q) {
            if ($q['answerIndex'] < 0 || $q['answerIndex'] >= count($q['options'])) {
                return response()->json([
                    'message' => "Question #".($i+1).": answerIndex out of range."
                ], 422);
            }
        }

        $path = "lessons/{$data['LessonID']}.json";

        Storage::put(
            $path,
            json_encode($data['questions'], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT)
        );

        // Đảm bảo kiểu bài là Quiz
        Lesson::where('LessonID', $data['LessonID'])->update(['LessonType' => 'Quiz']);

        return response()->json([
            'ok' => true,
            'file' => $path,
            'count' => count($data['questions'])
        ], 201);
    }

    // GET /api/admin/quizzes/{lessonId}
    public function show($lessonId)
    {
        // Kiểm tra lesson tồn tại
        $exists = Lesson::where('LessonID', $lessonId)->exists();
        if (!$exists) {
            return response()->json(['message' => 'Lesson not found'], 404);
        }

        $path = "lessons/{$lessonId}.json";
        if (!Storage::exists($path)) {
            // Chưa có câu hỏi
            return response()->json(['questions' => []]);
        }

        $questions = json_decode(Storage::get($path), true) ?: [];
        return response()->json(['questions' => $questions]);
    }
}
