<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Enrollment extends Model
{
    protected $table = 'enrollments';
    protected $primaryKey = 'EnrollmentID';
    public $incrementing = false;
    protected $keyType = 'string';

    public $timestamps = false;

    // Status constants (giảm lỗi chính tả)
    public const STATUS_PAID          = 'Paid';
    public const STATUS_PROCESSING    = 'Processing';
    public const STATUS_NOT_CONFIRMED = 'Not Confirmed';
    public const STATUS_REFUNDED      = 'Refunded';
    public const STATUS_CANCELED      = 'Canceled';

    protected $fillable = [
        'EnrollmentID','AccountID','CourseID','EnrollDate','EStatus',
    ];

    protected $casts = [
        'EnrollDate' => 'datetime',
    ];

    // ===== Appends: tự động đưa các field ảo vào JSON =====
    protected $appends = [
        'status_label',
        'enroll_date_formatted',
    ];

    // ===== QUAN HỆ (đã sửa) =====
    public function account()
    {
        // SỬA: dùng Account::class thay vì User::class
        return $this->belongsTo(\App\Models\Account::class, 'AccountID', 'AccountID');
    }

    public function course()
    {
        return $this->belongsTo(\App\Models\Course::class, 'CourseID', 'CourseID');
    }

    // ===== ACCESSORS =====

    /**
     * Chuẩn hóa trạng thái cho FE/report.
     * Ví dụ EStatus có thể lưu 'paid', 'PAID', 1 ... ta đổi về nhãn đẹp.
     */
    public function getStatusLabelAttribute(): string
    {
        $s = strtolower((string)($this->EStatus ?? ''));
        return match ($s) {
            'paid', 'success', 'completed', '1'   => self::STATUS_PAID,
            'processing', 'pending', 'waiting', '0' => self::STATUS_PROCESSING,
            'not confirmed', 'unconfirmed'        => self::STATUS_NOT_CONFIRMED,
            'refunded', 'refund', '2'             => self::STATUS_REFUNDED,
            'canceled', 'cancelled', '3'          => self::STATUS_CANCELED,
            default => $this->EStatus ? (string)$this->EStatus : '',
        };
    }

    /**
     * Định dạng EnrollDate thống nhất (Y-m-d H:i:ss). Trả chuỗi để FE hiển thị luôn.
     */
    public function getEnrollDateFormattedAttribute(): ?string
    {
        if (!$this->EnrollDate) return null;
        try {
            return $this->EnrollDate->format('Y-m-d H:i:s');
        } catch (\Throwable $e) {
            return (string) $this->EnrollDate;
        }
    }

    // ===== SCOPES tiện dụng =====

    /**
     * Chỉ lấy các cột cần cho dashboard/list.
     */
    public function scopeForDashboard($query)
    {
        return $query->select([
            'EnrollmentID','AccountID','CourseID','EnrollDate','EStatus',
        ]);
    }

    /**
     * Lấy N enrollment mới nhất (tuỳ theo PK/Ngày ghi).
     */
    public function scopeLatestById($query, int $limit = 10)
    {
        return $query->orderByDesc('EnrollmentID')->limit($limit);
    }
}
