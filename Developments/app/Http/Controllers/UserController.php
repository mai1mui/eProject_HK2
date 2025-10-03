<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class UserController extends Controller
{
    // ------- Helper: build URL cho avatar -------
    private function buildAvatarUrl(?string $avatar): string
    {
        $avatar = $avatar ?: 'avatar.jpg';
        // Nếu ảnh mặc định để ở public/avatar.jpg
        if ($avatar === 'avatar.jpg') {
            return asset('avatar.jpg');
        }
        // Ảnh upload nằm storage/app/public/...
        return asset('storage/' . ltrim($avatar, '/'));
    }

    // ------- GET /api/users -------
    public function index()
    {
        $users = DB::table('accounts')
            ->select('AccountID', 'AName', 'Email', 'ARole', 'AStatus', 'ApprovalStatus', 'CreatedAt', 'Avatar')
            ->get()
            ->map(function ($u) {
                $u->Avatar = $u->Avatar ?: 'avatar.jpg';
                $u->AvatarUrl = $this->buildAvatarUrl($u->Avatar);
                return $u;
            });

        return response()->json($users);
    }

    /**
     * ------- PUT /api/users/{id} -------
     * Cập nhật thông tin user:
     * - Cho phép đổi AccountID (PK dạng chuỗi)
     * - Cập nhật AName, Email, ARole, AStatus, ApprovalStatus
     * - Nhận file avatar (multipart) với key 'avatar' hoặc 'Avatar'
     * FE có thể gửi POST + _method=PUT (FormData)
     */
    public function update(Request $request, $id)
{
    try {
        // LOG tạm để kiểm tra request, có thể bỏ sau khi ok
        \Log::info('UPDATE USERS payload', ['id' => $id, 'all' => $request->all(), 'files' => $request->files->keys()]);

        // Gom 2 bộ tên field
        $merged = [
            'AccountID'       => $request->input('AccountID',       $request->input('account_id')),
            'AName'           => $request->input('AName',           $request->input('name')),
            'Email'           => $request->input('Email',           $request->input('email')),
            'ARole'           => $request->input('ARole',           $request->input('role')),
            'AStatus'         => $request->input('AStatus',         $request->input('status')),
            'ApprovalStatus'  => $request->input('ApprovalStatus',  $request->input('approval_status')),
        ];

        validator($merged, [
            'AccountID'      => 'nullable|string|max:50',
            'AName'          => 'nullable|string|max:255',
            'Email'          => 'nullable|email',
            'ARole'          => 'nullable|in:Admin,Instructor,Learner',
            'AStatus'        => 'nullable|in:Active,Inactive,Banned',
            'ApprovalStatus' => 'nullable|in:Approved,Pending,Rejected',
        ])->validate();

        $user = DB::table('accounts')->where('AccountID', $id)->first();
        if (!$user) return response()->json(['message' => 'User not found'], 404);

        // Build data update
        $data = [];
        foreach (['AccountID','AName','Email','ARole','AStatus','ApprovalStatus'] as $col) {
            if (isset($merged[$col]) && $merged[$col] !== '' && $merged[$col] !== null) {
                $data[$col] = $merged[$col];
            }
        }

        // Avatar
        if ($request->hasFile('avatar') || $request->hasFile('Avatar')) {
            $request->validate([
                'avatar' => 'nullable|image|mimes:jpg,jpeg,png,gif|max:2048',
                'Avatar' => 'nullable|image|mimes:jpg,jpeg,png,gif|max:2048',
            ]);
            $file = $request->file('avatar') ?: $request->file('Avatar');

            if (!empty($user->Avatar) && $user->Avatar !== 'avatar.jpg') {
                Storage::disk('public')->delete($user->Avatar);
            }
            $path = $file->store('avatars', 'public');
            $data['Avatar'] = $path;
        }

        if (empty($data)) {
            // Không đổi gì thì trả 200 cho FE
            return response()->json(['message' => 'Nothing changed'], 200);
        }

        $affected = DB::table('accounts')->where('AccountID', $id)->update($data);
        if ($affected === 0) {
            return response()->json(['message' => 'Nothing changed'], 200);
        }

        $newId = $data['AccountID'] ?? $id;
        $u = DB::table('accounts')
            ->select('AccountID','AName','Email','ARole','AStatus','ApprovalStatus','CreatedAt','Avatar')
            ->where('AccountID', $newId)
            ->first();

        if ($u) {
            $u->Avatar = $u->Avatar ?: 'avatar.jpg';
            $u->AvatarUrl = $u->Avatar === 'avatar.jpg' ? asset('avatar.jpg') : asset('storage/'.$u->Avatar);
        }

        return response()->json(['message' => 'User updated', 'data' => $u]);

    } catch (\Illuminate\Validation\ValidationException $e) {
        return response()->json(['message' => $e->getMessage(), 'errors' => $e->errors()], 422);
    } catch (\Throwable $e) {
        \Log::error('UPDATE USERS error', ['id'=>$id, 'msg'=>$e->getMessage()]);
        return response()->json(['message' => 'Server error: '.$e->getMessage()], 500);
    }
}

    /**
     * ------- POST /api/users/{id}/avatar (nếu bạn muốn dùng route này) -------
     * Upload avatar theo AccountID cụ thể
     */
    public function uploadAvatar(Request $request, $id)
    {
        $request->validate([
            'avatar' => 'required|image|mimes:jpg,jpeg,png,gif|max:2048',
        ]);

        $user = DB::table('accounts')->where('AccountID', $id)->first();
        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        if (!empty($user->Avatar) && $user->Avatar !== 'avatar.jpg') {
            Storage::disk('public')->delete($user->Avatar);
        }

        $path = $request->file('avatar')->store('avatars', 'public');

        DB::table('accounts')->where('AccountID', $id)->update(['Avatar' => $path]);

        return response()->json([
            'message' => 'Avatar updated successfully',
            'avatar'  => $path,
            'url'     => $this->buildAvatarUrl($path),
        ]);
    }

    /**
     * ------- POST /api/accounts/{id}/avatar (đang map ở api.php tới AuthController) -------
     * Nếu muốn giữ ở UserController, sửa route cho đúng.
     * Ở đây cung cấp thêm phiên bản: cập nhật avatar cho user đang đăng nhập.
     */
    public function updateAvatar(Request $request)
    {
        $request->validate([
            'avatar' => 'required|image|mimes:jpg,jpeg,png,gif|max:2048',
        ]);

        $account = $request->user(); // user đang đăng nhập (Sanctum)
        if (!$account) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        // Lấy bản ghi DB hiện tại
        $user = DB::table('accounts')->where('AccountID', $account->AccountID)->first();
        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        if (!empty($user->Avatar) && $user->Avatar !== 'avatar.jpg') {
            Storage::disk('public')->delete($user->Avatar);
        }

        $path = $request->file('avatar')->store('avatars', 'public');

        DB::table('accounts')
            ->where('AccountID', $account->AccountID)
            ->update(['Avatar' => $path]);

        return response()->json([
            'status'  => true,
            'message' => 'Avatar updated successfully',
            'avatar'  => $this->buildAvatarUrl($path),
        ]);
    }
    public function destroy($id)
{
    // Lấy user để xoá file avatar nếu có
    $user = \Illuminate\Support\Facades\DB::table('accounts')
        ->where('AccountID', $id)
        ->first();

    if (!$user) {
        return response()->json(['message' => 'User not found'], 404);
    }

    if (!empty($user->Avatar) && $user->Avatar !== 'avatar.jpg') {
        \Illuminate\Support\Facades\Storage::disk('public')->delete($user->Avatar);
    }

    $deleted = \Illuminate\Support\Facades\DB::table('accounts')
        ->where('AccountID', $id)
        ->delete();

    if (!$deleted) {
        return response()->json(['message' => 'User not found'], 404);
    }

    return response()->json(['message' => 'User deleted']);
}

}
