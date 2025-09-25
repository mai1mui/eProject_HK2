<?php

use Illuminate\Support\Facades\Route;
use App\Models\Account;
use App\Notifications\NewFeedbackNotification;

Route::view('/{path?}', 'welcome')->where('path', '.*');

// Test nhanh: tạo 1 notification cho Admin đầu tiên
Route::get('/dev/ping', function () {
    $admin = Account::where('ARole', 'Admin')->first();
    if ($admin) {
        $admin->notify(new NewFeedbackNotification([
            'title'   => 'Test Ping',
            'message' => 'This is a database notification (no queue, no ws).',
            'link'    => '/admin/feedback',
        ]));
    }
    return 'ok';
});