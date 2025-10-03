<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Notifications\DatabaseNotification;

class NotificationController extends Controller
{
    // 🔔 Bell: Enrollment/Payment/Submission
    public function index(Request $request)
    {
        $user = $request->user();

        $items = $user->notifications()
            ->whereIn('data->category', ['enrollment','payment','submission'])
            ->latest()
            ->take(20)
            ->get();

        return response()->json([
            'unread' => $items->whereNull('read_at')->count(),
            'items'  => $items->map(fn($n) => [
                'id'         => $n->id,
                'title'      => $n->data['title']   ?? 'Notification',
                'message'    => $n->data['message'] ?? '',
                'link'       => $n->data['link']    ?? null,
                'category'   => $n->data['category']?? 'general',
                'read_at'    => $n->read_at,
                'created_at' => $n->created_at->toDateTimeString(),
            ])->values(),
        ]);
    }

    // ✉️ Feedback riêng
    public function feedback(Request $request)
    {
        $user = $request->user();

        $items = $user->notifications()
            ->where('data->category', 'feedback')
            ->latest()
            ->take(20)
            ->get();

        return response()->json([
            'unread' => $items->whereNull('read_at')->count(),
            'items'  => $items->map(fn($n) => [
                'id'         => $n->id,
                'title'      => $n->data['title']   ?? 'Feedback',
                'message'    => $n->data['message'] ?? '',
                'link'       => $n->data['link']    ?? '/admin/feedback',
                'category'   => 'feedback',
                'read_at'    => $n->read_at,
                'created_at' => $n->created_at->toDateTimeString(),
            ])->values(),
        ]);
    }

    // Đánh dấu 1/many
    public function markRead(Request $request)
    {
        $request->validate(['ids' => 'required|array']);
        $request->user()->notifications()
            ->whereIn('id', $request->ids)
            ->update(['read_at' => now()]);

        return response()->json(['ok' => true]);
    }

    // 🔔: mark all
    public function markAllBell(Request $request)
    {
        $request->user()->notifications()
            ->whereIn('data->category', ['enrollment','payment','submission'])
            ->whereNull('read_at')
            ->update(['read_at' => now()]);

        return response()->json(['ok' => true]);
    }

    // ✉️: mark all
    public function markAllFeedback(Request $request)
    {
        $request->user()->notifications()
            ->where('data->category', 'feedback')
            ->whereNull('read_at')
            ->update(['read_at' => now()]);

        return response()->json(['ok' => true]);
    }
    public function unread(Request $request)
{
    $user = $request->user();

    $items = $user->unreadNotifications()
        ->latest()
        ->take(20)
        ->get();

    return response()->json([
        'count' => $items->count(),
        'items' => $items->map(fn($n) => [
            'id'         => $n->id,
            'title'      => $n->data['title']   ?? 'Notification',
            'message'    => $n->data['message'] ?? '',
            'link'       => $n->data['link']    ?? null,
            'category'   => $n->data['category']?? 'general',
            'created_at' => $n->created_at->toDateTimeString(),
        ])->values(),
    ]);
}
}

