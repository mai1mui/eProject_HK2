<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Storage;
use App\Models\Account;
use App\Models\ActivityLog;

class AuthController extends Controller
{
    // ================= Đăng nhập =================
    public function login(Request $request)
    {
        $request->validate([
            'email'    => 'required|email',
            'password' => 'required|min:3',
        ]);

        $email    = trim(strtolower($request->input('email')));
        $password = (string) $request->input('password');

        $user = Account::whereRaw('TRIM(LOWER(`Email`)) = ?', [$email])->first();
        if (!$user) {
            return response()->json(['message' => 'Email not found'], 404);
        }
        if (trim((string) $user->Pass) !== $password) {
            return response()->json(['message' => 'Wrong password'], 401);
        }

        $token = $user->createToken('api-token')->plainTextToken;

        $avatarFile = $user->Avatar ?: 'avatars/avatar.jpg';
        $avatarUrl  = asset('storage/' . $avatarFile);

        // Chuẩn hóa CreatedAt về timezone app và xuất ISO 8601 (giữ nguyên cách bạn đang làm)
        $createdAt = $user->CreatedAt
            ? $user->CreatedAt->timezone(config('app.timezone'))->toIso8601String()
            : null;

        // [ALOG] Login
        ActivityLog::record($user->AccountID, 'login');

        return response()->json([
            'message' => 'Login successful',
            'user'    => [
                'AccountID' => $user->AccountID,
                'AName'     => $user->AName,
                'Email'     => $user->Email,
                'ARole'     => $user->ARole,
                'AStatus'   => $user->AStatus,
                'Avatar'    => $avatarFile,
                'avatarUrl' => $avatarUrl,
                'CreatedAt' => $createdAt,
            ],
            'token'   => $token,
        ]);
    }

    // ================= Đăng ký =================
    public function register(Request $request)
    {
        $request->validate([
            'AName' => 'required|min:2',
            'Email' => 'required|email|unique:accounts',
            'Pass'  => 'required|min:6',
            'ARole' => 'required|in:Admin,Instructor,Learner',
        ]);

        $role = $request->ARole;
        $prefix = match ($role) {
            'Learner'    => 'LRN',
            'Instructor' => 'INS',
            'Admin'      => 'ADM',
            default      => 'ACC',
        };

        $lastId = DB::table('accounts')
            ->where('AccountID', 'LIKE', $prefix . '%')
            ->orderBy('AccountID', 'desc')
            ->value('AccountID');

        $num = $lastId ? intval(substr($lastId, 3)) + 1 : 1;
        $newAccountId = $prefix . str_pad($num, 3, '0', STR_PAD_LEFT);
        $approval = $role === 'Instructor' ? 'Pending' : 'Approved';

        $account = Account::create([
            'AccountID'      => $newAccountId,
            'AName'          => $request->AName,
            'Email'          => $request->Email,
            'Pass'           => $request->Pass, // DEMO: plain
            'ARole'          => $role,
            'AStatus'        => 'Active',
            'ApprovalStatus' => $approval,
            'Avatar'         => 'avatars/avatar.jpg',
        ]);

        $token = $account->createToken('api-token')->plainTextToken;
        $account->refresh();

        $createdAt = $account->CreatedAt
            ? $account->CreatedAt->timezone(config('app.timezone'))->toIso8601String()
            : null;

        // [ALOG] Register
        ActivityLog::record($account->AccountID, 'register');

        return response()->json([
            'message' => 'Register successful',
            'user'    => [
                'AccountID' => $account->AccountID,
                'AName'     => $account->AName,
                'Email'     => $account->Email,
                'ARole'     => $account->ARole,
                'AStatus'   => $account->AStatus,
                'Avatar'    => $account->Avatar,
                'avatarUrl' => asset('storage/' . $account->Avatar),
                'CreatedAt' => $createdAt,
            ],
            'token'   => $token,
        ], 201);
    }

    // ================= Update account (name/email/password) =================
    public function update(Request $request, $id)
    {
        $account = Account::find($id);
        if (!$account) {
            return response()->json(['message' => 'Account not found'], 404);
        }

        $request->validate([
            'AName'        => ['sometimes', 'string', 'min:2'],
            'Email'        => ['sometimes', 'email', Rule::unique('accounts', 'Email')->ignore($account->AccountID, 'AccountID')],
            'new_password' => ['sometimes', 'nullable', 'min:6', 'confirmed'], // requires new_password_confirmation
        ]);

        $dirty = false;

        if ($request->filled('AName') && $request->AName !== $account->AName) {
            $account->AName = $request->AName;
            $dirty = true;
        }
        if ($request->filled('Email') && $request->Email !== $account->Email) {
            $account->Email = $request->Email;
            $dirty = true;
        }
        if ($request->filled('new_password')) {
            // DEMO: plain-text (sản phẩm thật hãy Hash::make)
            $account->Pass = $request->new_password;
            $dirty = true;

            // [ALOG] Password changed (ghi riêng nếu muốn)
            ActivityLog::record($account->AccountID, 'password.change');
        }

        if (!$dirty) {
            return response()->json(['message' => 'No valid field to update'], 422);
        }

        $account->save();

        // [ALOG] Profile update
        ActivityLog::record($account->AccountID, 'profile.update', [
            'changed' => array_keys($request->all()),
        ]);

        $avatarFile = $account->Avatar ?: 'avatars/avatar.jpg';
        $avatarUrl  = asset('storage/' . $avatarFile);

        $createdAt = $account->CreatedAt
            ? $account->CreatedAt->timezone(config('app.timezone'))->toIso8601String()
            : null;

        return response()->json([
            'message' => 'Account updated successfully',
            'user'    => [
                'AccountID' => $account->AccountID,
                'AName'     => $account->AName,
                'Email'     => $account->Email,
                'ARole'     => $account->ARole,
                'AStatus'   => $account->AStatus,
                'Avatar'    => $avatarFile,
                'avatarUrl' => $avatarUrl,
                'CreatedAt' => $createdAt,
            ],
        ]);
    }

    // ================= Reset Password (Forgot Password) =================
    public function forgotPassword(Request $request)
    {
        $request->validate([
            'Email'        => 'required|email|exists:accounts,Email',
            'new_password' => 'required|min:6|confirmed',
        ]);

        $user = Account::where('Email', $request->Email)->first();
        if (!$user) {
            return response()->json(['message' => 'Email not found'], 404);
        }

        // DEMO: plain
        $user->Pass = $request->new_password;
        $user->save();

        // [ALOG] Password reset (forgot)
        ActivityLog::record($user->AccountID, 'password.reset', [
            'email' => $user->Email,
        ]);

        return response()->json([
            'message' => 'Password reset successful. You can now login with your new password.',
        ]);
    }

    // ================= Đăng xuất =================
    public function logout(Request $request)
    {
        // [ALOG] Logout
        ActivityLog::record($request->user()->AccountID, 'logout');

        $request->user()->tokens()->delete();
        return response()->json(['message' => 'Logged out']);
    }

    // ================= Social Login (Demo stub) =================
    public function googleLogin(Request $request)
    {
        return response()->json(['message' => 'Google login not implemented in demo'], 501);
    }

    public function facebookLogin(Request $request)
    {
        return response()->json(['message' => 'Facebook login not implemented in demo'], 501);
    }

    public function appleLogin(Request $request)
    {
        return response()->json(['message' => 'Apple login not implemented in demo'], 501);
    }

    // ================= Cập nhật Avatar =================
    public function updateAvatar(Request $request, $id)
    {
        $request->validate([
            'avatar' => 'required|image|mimes:jpg,jpeg,png,gif|max:2048',
        ]);

        $user = Account::find($id);
        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        // Xóa ảnh cũ nếu khác ảnh mặc định
        if ($user->Avatar && $user->Avatar !== 'avatars/avatar.jpg') {
            Storage::disk('public')->delete($user->Avatar);
        }

        // Lưu ảnh mới
        $path = $request->file('avatar')->store('avatars', 'public');
        $user->Avatar = $path;
        $user->save();

        // [ALOG] Avatar updated
        ActivityLog::record($user->AccountID, 'avatar.update', [
            'path' => $path,
        ]);

        return response()->json([
            'message' => 'Avatar updated successfully',
            'avatar'  => $path,
            'url'     => asset('storage/' . $path),
        ]);
    }
}
