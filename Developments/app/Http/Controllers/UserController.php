<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class UserController extends Controller
{
    // Lấy danh sách user
    public function index()
    {
        $users = DB::table('accounts')
            ->select('AccountID', 'AName', 'Email', 'ARole', 'AStatus', 'ApprovalStatus', 'CreatedAt', 'Avatar')
            ->get()
            ->map(function ($u) {
                // Nếu Avatar null thì dùng ảnh mặc định
                $u->Avatar = $u->Avatar ?: 'avatar.jpg';

                // Trả về link đầy đủ (nếu avatar.jpg thì lấy từ public/, còn lại từ storage/)
                if ($u->Avatar === 'avatar.jpg') {
                    $u->AvatarUrl = asset('avatar.jpg');
                } else {
                    $u->AvatarUrl = asset('storage/' . $u->Avatar);
                }
                return $u;
            });

        return response()->json($users);
    }

    // Cập nhật role hoặc status
    public function update(Request $request, $id)
    {
        $request->validate([
            'ARole'   => 'nullable|in:Admin,Instructor,Learner',
            'AStatus' => 'nullable|in:Active,Inactive,Banned',
        ]);

        $data = [];
        if ($request->has('ARole')) {
            $data['ARole'] = $request->ARole;
        }
        if ($request->has('AStatus')) {
            $data['AStatus'] = $request->AStatus;
        }

        if (empty($data)) {
            return response()->json(['message' => 'No valid field to update'], 400);
        }

        $updated = DB::table('accounts')->where('AccountID', $id)->update($data);

        if (!$updated) {
            return response()->json(['message' => 'User not found or not updated'], 404);
        }

        return response()->json(['message' => 'User updated']);
    }

    // Xoá user
    public function destroy($id)
    {
        $deleted = DB::table('accounts')->where('AccountID', $id)->delete();

        if (!$deleted) {
            return response()->json(['message' => 'User not found'], 404);
        }

        return response()->json(['message' => 'User deleted']);
    }

    // Upload Avatar
    public function uploadAvatar(Request $request, $id)
    {
        $request->validate([
            'avatar' => 'required|image|mimes:jpg,jpeg,png,gif|max:2048',
        ]);

        // Kiểm tra user tồn tại
        $user = DB::table('accounts')->where('AccountID', $id)->first();
        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        // Nếu user có avatar cũ (và không phải avatar mặc định) thì xóa file cũ
        if ($user->Avatar && $user->Avatar !== 'avatar.jpg') {
            Storage::disk('public')->delete($user->Avatar);
        }

        // Lưu ảnh mới vào storage/app/public/avatars
        $path = $request->file('avatar')->store('avatars', 'public');

        // Cập nhật DB
        DB::table('accounts')
            ->where('AccountID', $id)
            ->update(['Avatar' => $path]);

        return response()->json([
            'message' => 'Avatar updated successfully',
            'avatar'  => $path,
            'url'     => asset('storage/' . $path), // trả về link đầy đủ
        ]);
    }
    public function updateAvatar(Request $request)
{
    $request->validate([
        'avatar' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
    ]);

    $account = auth()->user(); // lấy user đang login

    // Lưu file vào storage/app/public/avatars
    $path = $request->file('avatar')->store('avatars', 'public');

    // Update database
    $account->avatar = $path;
    $account->save();

    return response()->json([
        'status' => true,
        'message' => 'Avatar updated successfully',
        'avatar' => asset('storage/' . $path),
    ]);
}
}
