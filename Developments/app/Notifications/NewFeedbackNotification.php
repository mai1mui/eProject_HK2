<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class NewFeedbackNotification extends Notification
{
    use Queueable;

    public function __construct(public array $payload) {}

    public function via($notifiable)
    {
        return ['database']; // chỉ lưu DB, không broadcast
    }

    public function toDatabase($notifiable)
    {
        return [
            'title'   => $this->payload['title']   ?? 'Notification',
            'message' => $this->payload['message'] ?? '',
            'link'    => $this->payload['link']    ?? null,
        ];
    }
}
