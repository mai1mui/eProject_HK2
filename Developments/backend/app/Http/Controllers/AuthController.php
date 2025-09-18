<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Account;

class AuthController extends Controller
{
    // Đăng nhập
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|min:6'
        ]);

        $user = Account::where('Email', $request->email)->first();

        // So sánh plain text thay vì Hash::check()
        if (!$user || $user->Pass !== $request->password) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        return response()->json([
            'message' => 'Login successful',
            'user' => $user
        ]);
    }

    // Đăng ký (demo)
    public function register(Request $request)
    {
        $request->validate([
            'AccountID' => 'required|unique:accounts',
            'AName' => 'required|min:2',
            'Email' => 'required|email|unique:accounts',
            'Pass' => 'required|min:6',
            'ARole' => 'required|in:Admin,Instructor,Learner',
        ]);

        $account = Account::create([
            'AccountID' => $request->AccountID,
            'AName' => $request->AName,
            'Email' => $request->Email,
            'Pass' => $request->Pass, //  plain text để demo
            'ARole' => $request->ARole,
            'AStatus' => 'Active',
        ]);

        return response()->json([
            'message' => 'Register successful',
            'user' => $account
        ]);
    }
}
