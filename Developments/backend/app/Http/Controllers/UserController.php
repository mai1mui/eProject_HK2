<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Account;

class UserController extends Controller
{
    public function index()
    {
        return Account::all();
    }

    public function update(Request $request, $id)
    {
        $user = Account::findOrFail($id);
        $user->update($request->only(['AName', 'Email', 'ARole', 'AStatus']));
        return response()->json(['message' => 'Updated', 'user' => $user]);
    }

    public function destroy($id)
    {
        Account::destroy($id);
        return response()->json(['message' => 'Deleted']);
    }
}
