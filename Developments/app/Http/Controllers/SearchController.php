<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Account;
use App\Models\Course;
use App\Models\Lesson;

class SearchController extends Controller
{
    public function search(Request $request)
    {
        $query = $request->get('query');

        if (!$query || strlen($query) < 2) {
            return response()->json([]);
        }

        $results = [];

        // Accounts
        $accounts = Account::where('AName', 'like', "%$query%")
            ->orWhere('Email', 'like', "%$query%")
            ->limit(5)
            ->get(['AccountID as id', 'AName as label']);

        foreach ($accounts as $a) {
            $results[] = [
                'type' => 'Account',
                'label' => $a->label,
                'path' => '/admin/users'
            ];
        }

        // Courses
        $courses = Course::where('title', 'like', "%$query%")
            ->limit(5)
            ->get(['id', 'title as label']);

        foreach ($courses as $c) {
            $results[] = [
                'type' => 'Course',
                'label' => $c->label,
                'path' => '/admin/courses'
            ];
        }

        // Lessons
        $lessons = Lesson::where('title', 'like', "%$query%")
            ->limit(5)
            ->get(['id', 'title as label']);

        foreach ($lessons as $l) {
            $results[] = [
                'type' => 'Lesson',
                'label' => $l->label,
                'path' => '/admin/lessons'
            ];
        }

        return response()->json($results);
    }
}
