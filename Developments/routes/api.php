<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\DB;

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
use App\Http\Controllers\LessonController;
use App\Http\Controllers\AdminMediaController;
use App\Http\Controllers\AdminQuizController;
use App\Http\Controllers\AdminSummaryController;
use App\Http\Controllers\ReportDashboardController;
use App\Http\Controllers\AdminListController;

/*
|--------------------------------------------------------------------------
| Public APIs
|--------------------------------------------------------------------------
| Không yêu cầu auth
*/
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login',    [AuthController::class, 'login']);
Route::post('/reset-password', [AuthController::class, 'forgotPassword']);

Route::post('/social-login/google',   [AuthController::class, 'googleLogin']);
Route::post('/social-login/facebook', [AuthController::class, 'facebookLogin']);
Route::post('/social-login/apple',    [AuthController::class, 'appleLogin']);

Route::get('/creators', [CreatorController::class, 'index']);
Route::get('/courses-public', [CourseController::class, 'publicIndex']);
/*
|--------------------------------------------------------------------------
| (Tùy chọn) Public read-only reports cho trang chart/landing
| Nếu muốn bảo vệ, hãy chuyển nhóm này vào trong auth.
|--------------------------------------------------------------------------
*/


/*
|--------------------------------------------------------------------------
| Protected APIs (auth:sanctum)
|--------------------------------------------------------------------------
*/
Route::middleware('auth:sanctum')->group(function () {
    Route::prefix('reports')->group(function () {
    Route::get('/summary',               [ReportDashboardController::class, 'summary']);
    Route::get('/students-per-course',   [ReportDashboardController::class, 'studentsPerCourse']);
    Route::get('/registrations-series',  [ReportDashboardController::class, 'registrationsSeries']);
    Route::get('/roles-pie',             [ReportDashboardController::class, 'rolesPie']);
    Route::get('/latest-users',          [ReportDashboardController::class, 'latestUsers']);
     Route::get('/revenue-series', [ReportDashboardController::class, 'revenueSeries']);
});

    /*
    |----------------------------------------------------------------------
    | Health & Summary cho Dashboard (FE đang gọi)
    |----------------------------------------------------------------------
    */
    Route::get('/health', function () {
        try {
            DB::select('SELECT 1'); // test DB
            $db = true;
        } catch (\Throwable $e) {
            $db = false;
        }
        return response()->json([
            'api' => true,
            'db'  => $db,
            'jobs'=> true, // tuỳ bạn kiểm tra queue thực tế
        ]);
    });

    Route::get('/admin/summary', [AdminSummaryController::class, 'index']);

    /*
    |----------------------------------------------------------------------
    | Dashboard compact lists (KHÔNG ĐƯỢC TRÙNG URI VỚI CRUD)
    |----------------------------------------------------------------------
    | FE dùng:
    | - GET /api/admin/list/payments?per_page=5
    | - GET /api/admin/list/courses?sort=top&per_page=5
    | - GET /api/admin/list/accounts?per_page=4
    */
   Route::middleware('auth:sanctum')->prefix('admin/list')->group(function () {
    Route::get('/payments',  [\App\Http\Controllers\AdminListController::class, 'payments']);
    Route::get('/accounts',  [\App\Http\Controllers\AdminListController::class, 'accounts']);
    Route::get('/courses',   [\App\Http\Controllers\AdminListController::class, 'courses']);
});

    /*
    |----------------------------------------------------------------------
    | Current user
    |----------------------------------------------------------------------
    */
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    /*
    |----------------------------------------------------------------------
    | Search (global search)
    |----------------------------------------------------------------------
    */
    Route::get('/search', [SearchController::class, 'search']);

    /*
    |----------------------------------------------------------------------
    | Users (khu vực Admin)
    |----------------------------------------------------------------------
    */
    Route::get('/users', [UserController::class, 'index']);
    // Nhận cả PUT và POST (FormData với _method=PUT)
    Route::match(['put', 'post'], '/users/{id}', [UserController::class, 'update']);
    Route::delete('/users/{id}', [UserController::class, 'destroy']);

    // Upload avatar theo AccountID hoặc user hiện tại
    Route::post('/users/{id}/avatar', [UserController::class, 'uploadAvatar']);
    Route::post('/me/avatar',         [UserController::class, 'updateAvatar']);

    /*
    |----------------------------------------------------------------------
    | Account self-update (FE Settings)
    |----------------------------------------------------------------------
    */
    Route::match(['put', 'patch'], '/accounts/{id}', [AuthController::class, 'update']);
    Route::post('/accounts/{id}/avatar',             [AuthController::class, 'updateAvatar']);

    /*
    |----------------------------------------------------------------------
    | Notifications
    |----------------------------------------------------------------------
    */
    Route::get('/notifications',                    [NotificationController::class, 'index']);
    Route::get('/notifications/unread',             [NotificationController::class, 'unread']);
    Route::get('/notifications/feedback',           [NotificationController::class, 'feedback']);
    Route::post('/notifications/mark-read',         [NotificationController::class, 'markRead']); // mark nhiều bằng IDs
    Route::post('/notifications/mark-all-read',     [NotificationController::class, 'markAllBell']);
    Route::post('/notifications/feedback/mark-all-read', [NotificationController::class, 'markAllFeedback']);
    Route::post('/notifications/{id}/read',         [NotificationController::class, 'markRead']); // mark 1 id

    /*
    |----------------------------------------------------------------------
    | Admin uploads & quizzes
    |----------------------------------------------------------------------
    */
    Route::post('/admin/uploads', [AdminMediaController::class, 'store']);   // multipart upload
    Route::delete('/admin/uploads', [AdminMediaController::class, 'destroy']);
    Route::post('/admin/quizzes', [AdminQuizController::class, 'store']);
    Route::get('/admin/quizzes/{lessonId}', [AdminQuizController::class, 'show']);
  Route::get('/admin/list/accounts', [AdminListController::class, 'accounts'])->middleware('auth:sanctum');
    /*
    |----------------------------------------------------------------------
    | Courses (CRUD CHÍNH THỨC)
    |----------------------------------------------------------------------
    */
    Route::get('/courses',         [CourseController::class, 'index']);
    Route::post('/courses',        [CourseController::class, 'store']);
    Route::put('/courses/{id}',    [CourseController::class, 'update']);
    Route::delete('/courses/{id}', [CourseController::class, 'destroy']);

    /*
    |----------------------------------------------------------------------
    | Lessons (CRUD)
    |----------------------------------------------------------------------
    */
    Route::get('/lessons',         [LessonController::class, 'index']);
    Route::post('/lessons',        [LessonController::class, 'store']);
    Route::put('/lessons/{id}',    [LessonController::class, 'update']);
    Route::delete('/lessons/{id}', [LessonController::class, 'destroy']);

    /*
    |----------------------------------------------------------------------
    | Enrollments (CRUD)
    |----------------------------------------------------------------------
    */
    Route::get('/enrollments',         [EnrollmentController::class, 'index']);
    Route::post('/enrollments',        [EnrollmentController::class, 'store']);
    Route::put('/enrollments/{id}',    [EnrollmentController::class, 'update']);
    Route::delete('/enrollments/{id}', [EnrollmentController::class, 'destroy']);

    /*
    |----------------------------------------------------------------------
    | Reports (server-side aggregate) - BẢO VỆ
    | Nếu bạn đã cho phép public bên trên thì giữ cả hai nhóm,
    | còn muốn khoá thì bỏ nhóm public ở trên.
    |----------------------------------------------------------------------
    */
    Route::prefix('reports')->group(function () {
        Route::get('/summary',               [ReportController::class, 'summary']);
        Route::get('/students-per-course',   [ReportController::class, 'studentsPerCourse']);
        Route::get('/registrations-series',  [ReportController::class, 'registrationsSeries']);
        Route::get('/roles-pie',             [ReportController::class, 'rolesPie']);
        Route::get('/latest-users',          [ReportController::class, 'latestUsers']);
    });

    /*
    |----------------------------------------------------------------------
    | Feedback (CRUD)
    |----------------------------------------------------------------------
    */
    Route::get('/feedback',          [FeedbackController::class, 'index']);
    Route::get('/feedback/{id}',     [FeedbackController::class, 'show']);
    Route::post('/feedback',         [FeedbackController::class, 'store']);
    Route::put('/feedback/{id}',     [FeedbackController::class, 'update']);
    Route::delete('/feedback/{id}',  [FeedbackController::class, 'destroy']);

    /*
    |----------------------------------------------------------------------
    | Submissions (CRUD + download)
    |----------------------------------------------------------------------
    */
    Route::get('/submissions',           [SubmissionController::class, 'index']);
    Route::post('/submissions',          [SubmissionController::class, 'store']);
    Route::put('/submissions/{id}',      [SubmissionController::class, 'update']);
    Route::delete('/submissions/{id}',   [SubmissionController::class, 'destroy']);

    // Hỗ trợ multipart update qua POST + _method=PUT (KHÔNG xoá route PUT)
    Route::post('/submissions/{id}',     [SubmissionController::class, 'update']);

    // Endpoint download: trả header Content-Disposition
    Route::get('/submissions/{id}/download', [SubmissionController::class, 'download']);

    /*
    |----------------------------------------------------------------------
    | Payments (CRUD CHÍNH THỨC)
    |----------------------------------------------------------------------
    */
    Route::get('/payments',          [PaymentController::class, 'index']);
    Route::get('/payments/{id}',     [PaymentController::class, 'show']);
    Route::post('/payments',         [PaymentController::class, 'store']);
    Route::put('/payments/{id}',     [PaymentController::class, 'update']);
    Route::delete('/payments/{id}',  [PaymentController::class, 'destroy']);

    /*
    |----------------------------------------------------------------------
    | Results (CRUD)
    |----------------------------------------------------------------------
    */
    Route::get('/results',          [ResultController::class, 'index']);
    Route::get('/results/{id}',     [ResultController::class, 'show']);
    Route::post('/results',         [ResultController::class, 'store']);
    Route::put('/results/{id}',     [ResultController::class, 'update']);
    Route::delete('/results/{id}',  [ResultController::class, 'destroy']);

    /*
    |----------------------------------------------------------------------
    | Logout
    |----------------------------------------------------------------------
    */
    Route::post('/logout', [AuthController::class, 'logout']);
    
    Route::middleware('auth:sanctum')->get('/my/activity-logs', function (\Illuminate\Http\Request $request) {
    $action = $request->query('action');          // vd: login, logout, avatar.update...
    $per    = (int) $request->query('per_page', 10);

    $q = \App\Models\ActivityLog::where('AccountID', $request->user()->AccountID)
        ->orderByDesc('id');

    if ($action !== null && $action !== '') {
        $q->where('action', $action);
    }

    $p = $q->paginate($per);

    return response()->json([
        'data'      => $p->items(),
        'total'     => $p->total(),
        'per_page'  => $p->perPage(),
        'page'      => $p->currentPage(),
    ]);
});
});
