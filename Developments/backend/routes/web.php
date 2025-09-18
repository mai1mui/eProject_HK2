<?php

use Illuminate\Support\Facades\Route;

Route::view('/{path?}', 'welcome')
    ->where('path', '.*');   // match mọi route cho React
