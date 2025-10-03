<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ActivityLog;

class ActivityLogController extends Controller
{
    // Admin: xem tất cả log + filter
    public function index(Request $request)
    {
        $this->authorizeAdmin($request);

        $q = ActivityLog::query();

        if ($request->filled('AccountID')) {
            $q->where('AccountID', $request->AccountID);
        }
        if ($request->filled('action')) {
            $q->where('action', 'LIKE', '%'.$request->action.'%');
        }
        if ($request->filled('date_from')) {
            $q->where('created_at', '>=', $request->date_from);
        }
        if ($request->filled('date_to')) {
            $q->where('created_at', '<=', $request->date_to);
        }

        $logs = $q->orderByDesc('id')->paginate(20);

        return response()->json([
            'items' => $logs->items(),
            'total' => $logs->total(),
            'page'  => $logs->currentPage(),
            'last'  => $logs->lastPage(),
        ]);
    }

    // User: xem log của chính mình
    public function myLogs(Request $request)
    {
        $user = $request->user();
        $logs = ActivityLog::where('AccountID', $user->AccountID)
            ->orderByDesc('id')
            ->paginate(20);

        return response()->json([
            'items' => $logs->items(),
            'total' => $logs->total(),
            'page'  => $logs->currentPage(),
            'last'  => $logs->lastPage(),
        ]);
    }

    // (tuỳ chọn) Admin: xoá 1 log
    public function destroy(Request $request, $id)
    {
        $this->authorizeAdmin($request);

        $log = ActivityLog::find($id);
        if (!$log) {
            return response()->json(['message' => 'Log not found'], 404);
        }
        $log->delete();
        return response()->json(['message' => 'Log deleted']);
    }

    private function authorizeAdmin(Request $request): void
    {
        $u = $request->user();
        if (!$u || !in_array($u->ARole, ['Admin'])) {
            abort(403, 'Forbidden');
        }
    }
}
