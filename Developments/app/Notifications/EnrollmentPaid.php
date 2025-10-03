<?php

namespace App\Notifications;

use App\Models\Enrollment;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;

class EnrollmentPaid extends Notification
{
    use Queueable;

    public function __construct(public Enrollment $enrollment) {}

   public function via($notifiable)
{
    return ['mail','database'];
}

public function toDatabase($notifiable)
{
    return [
        'type'         => 'enrollment.paid',
        'EnrollmentID' => $this->enrollment->EnrollmentID,
        'CourseID'     => $this->enrollment->CourseID,
    ];
}
    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject('Payment confirmed for your course')
            ->greeting('Hello ' . ($notifiable->AName ?? $notifiable->name ?? ''))
            ->line('Your enrollment has been marked as Paid.')
            ->line('Enrollment: ' . $this->enrollment->EnrollmentID)
            ->line('Course: ' . $this->enrollment->CourseID)
            ->line('Enroll date: ' . ($this->enrollment->EnrollDate ?? '—'))
            ->line('Enjoy your course!')
            ->salutation('Best regards');
    }
}
