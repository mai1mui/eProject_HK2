<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class AdminSummaryController extends Controller
{
    public function index(Request $request)
    {
        $start = Carbon::now()->startOfMonth();
        $end   = Carbon::now()->endOfMonth();

        $totalUsers = DB::table('accounts')->count();

        $activeCourses = DB::table('courses')
            ->where('CStatus', 'Active')
            ->count();

        // Assignments = lessons.LessonType = 'Assignment'
        $assignments = DB::table('lessons')
            ->where('LessonType', 'Assignment')
            ->count();

        // Doanh thu tháng hiện tại (payment.PStatus = 'Paid')
        $monthlyRevenue = (float) DB::table('payment')
            ->where('PStatus', 'Paid')
            ->whereBetween('PayDate', [$start, $end])
            ->sum('Amount');

        return response()->json([
            'total_users'     => $totalUsers,
            'active_courses'  => $activeCourses,
            'assignments'     => $assignments,
            'monthly_revenue' => round($monthlyRevenue, 2),
        ]);
    }
}
