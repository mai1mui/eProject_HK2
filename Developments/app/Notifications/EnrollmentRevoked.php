<?php

namespace App\Notifications;

use App\Models\Enrollment;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;

class EnrollmentRevoked extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(public Enrollment $enrollment) {}

    public function via($notifiable)
    {
        // có thể thêm 'database' nếu muốn lưu vào notifications table
        return ['mail'];
    }

    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject('Your course access has been revoked')
            ->greeting('Hello ' . ($notifiable->AName ?? $notifiable->name ?? ''))
            ->line('Your enrollment access has been revoked.')
            ->line('Enrollment: ' . $this->enrollment->EnrollmentID)
            ->line('Course: ' . $this->enrollment->CourseID)
            ->line('If you think this is a mistake, please contact our support.')
            ->salutation('Best regards');
    }
}
