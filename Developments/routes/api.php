<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Controllers
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\FeedbackController;
use App\Http\Controllers\CreatorController;
use App\Http\Controllers\EnrollmentController;
use App\Http\Controllers\SubmissionController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\ResultController;
use App\Http\Controllers\SearchController;
use App\Http\Controllers\NotificationController;

// ================= Public =================
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login',    [AuthController::class, 'login']);
Route::post('/reset-password', [AuthController::class, 'forgotPassword']);
Route::post('/social-login/google',   [AuthController::class, 'googleLogin']);
Route::post('/social-login/facebook', [AuthController::class, 'facebookLogin']);
Route::post('/social-login/apple',    [AuthController::class, 'appleLogin']);

Route::get('/creators', [CreatorController::class, 'index']);

// ================= Protected (auth:sanctum) =================
Route::middleware('auth:sanctum')->group(function () {
    // current user
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // Search
    Route::get('/search', [SearchController::class, 'search']);

    // Users (Admin)
    Route::get('/users',        [UserController::class, 'index']);
    Route::put('/users/{id}',   [UserController::class, 'update']);
    Route::delete('/users/{id}',[UserController::class, 'destroy']);

    // Account self-update + avatar (khớp FE)
    Route::match(['put','patch'], '/accounts/{id}', [AuthController::class, 'update']);
    Route::post('/accounts/{id}/avatar',            [AuthController::class, 'updateAvatar']);

    // Notifications
    Route::get('/notifications',                   [NotificationController::class, 'index']);
    Route::post('/notifications/mark-read',        [NotificationController::class, 'markRead']);
    Route::post('/notifications/mark-all-read',    [NotificationController::class, 'markAllBell']);
    Route::get('/notifications/feedback',          [NotificationController::class, 'feedback']);
    Route::post('/notifications/feedback/mark-all-read', [NotificationController::class, 'markAllFeedback']);
    Route::get('/notifications/unread',            [NotificationController::class, 'unread']);
    Route::post('/notifications/{id}/read',        [NotificationController::class, 'markRead']);

    Route::middleware('auth:sanctum')->get('/my/activity-logs', function (\Illuminate\Http\Request $request) {
    $action = $request->query('action');          // vd: login, logout, avatar.update...
    $per    = (int) $request->query('per_page', 10);

    $q = \App\Models\ActivityLog::where('AccountID', $request->user()->AccountID)
        ->orderByDesc('id');

    if ($action !== null && $action !== '') {
        $q->where('action', $action);
    }

    $p = $q->paginate($per);

    // ⭐ Trả về format đúng với FE
    return response()->json([
        'data'      => $p->items(),
        'total'     => $p->total(),
        'per_page'  => $p->perPage(),
        'page'      => $p->currentPage(),
    ]);
});


    // Courses
    Route::get('/courses',      [CourseController::class, 'index']);
    Route::post('/courses',     [CourseController::class, 'store']);
    Route::put('/courses/{id}', [CourseController::class, 'update']);
    Route::delete('/courses/{id}', [CourseController::class, 'destroy']);

    // Enrollments
    Route::get('/enrollments',        [EnrollmentController::class, 'index']);
    Route::post('/enrollments',       [EnrollmentController::class, 'store']);
    Route::put('/enrollments/{id}',   [EnrollmentController::class, 'update']);
    Route::delete('/enrollments/{id}',[EnrollmentController::class, 'destroy']);

    // Reports
    Route::get('/reports',       [ReportController::class, 'index']);
    Route::put('/reports/{id}',  [ReportController::class, 'update']);
    Route::delete('/reports/{id}', [ReportController::class, 'destroy']);

    // Feedback
    Route::get('/feedback',        [FeedbackController::class, 'index']);
    Route::get('/feedback/{id}',   [FeedbackController::class, 'show']);
    Route::post('/feedback',       [FeedbackController::class, 'store']);
    Route::put('/feedback/{id}',   [FeedbackController::class, 'update']);
    Route::delete('/feedback/{id}',[FeedbackController::class, 'destroy']);

    // Submissions
    Route::get('/submissions',        [SubmissionController::class, 'index']);
    Route::post('/submissions',       [SubmissionController::class, 'store']);
    Route::put('/submissions/{id}',   [SubmissionController::class, 'update']);
    Route::delete('/submissions/{id}',[SubmissionController::class, 'destroy']);

    // Payments
    Route::get('/payments',        [PaymentController::class, 'index']);
    Route::get('/payments/{id}',   [PaymentController::class, 'show']);
    Route::post('/payments',       [PaymentController::class, 'store']);
    Route::put('/payments/{id}',   [PaymentController::class, 'update']);
    Route::delete('/payments/{id}',[PaymentController::class, 'destroy']);

    // Results
    Route::get('/results',        [ResultController::class, 'index']);
    Route::get('/results/{id}',   [ResultController::class, 'show']);
    Route::post('/results',       [ResultController::class, 'store']);
    Route::put('/results/{id}',   [ResultController::class, 'update']);
    Route::delete('/results/{id}',[ResultController::class, 'destroy']);

    // Logout
    Route::post('/logout', [AuthController::class, 'logout']);
});
