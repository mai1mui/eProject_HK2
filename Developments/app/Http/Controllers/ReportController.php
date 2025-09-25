<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Account;
use App\Models\Course;
use App\Models\Payment;

class ReportController extends Controller
{
    public function index(Request $request)
    {
        $from = $request->query('from');
        $to   = $request->query('to');

        // Base query
        $userQuery = Account::query();
        $courseQuery = Course::query();
        $paymentQuery = Payment::query();

        if ($from && $to) {
            $userQuery->whereBetween('created_at', [$from, $to]);
            $courseQuery->whereBetween('created_at', [$from, $to]);
            $paymentQuery->whereBetween('created_at', [$from, $to]);
        }

        $stats = [
            'users' => $userQuery->count(),
            'courses' => $courseQuery->count(),
            'revenue' => $paymentQuery->sum('amount'),
            'complete' => rand(50, 95), // demo % completion
        ];

        $newUsers = $userQuery->orderBy('created_at', 'desc')
            ->take(10)
            ->get(['name', 'role', 'created_at', 'status']);

        return response()->json([
            'stats' => $stats,
            'new_users' => $newUsers,
        ]);
    }
}
