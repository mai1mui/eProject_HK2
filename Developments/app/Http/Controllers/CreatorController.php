<?php

namespace App\Http\Controllers;

use App\Models\Account;
use Illuminate\Http\Request;

class CreatorController extends Controller
{
    public function index()
    {
        // Lấy danh sách Instructor từ bảng accounts
        $creators = Account::where('ARole', 'Instructor')->get([
            'AccountID', 'AName', 'Email'
        ]);

        return response()->json($creators);
    }
}
