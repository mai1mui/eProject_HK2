<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    // ====== (GIỮ NGUYÊN) CẤU HÌNH CÓ SẴN ======
    protected $table = 'payment';

    protected $primaryKey = 'PaymentID';
    public $incrementing = false;
    protected $keyType = 'string';

    public $timestamps = false;

    protected $fillable = [
        'PaymentID',
        'AccountID',
        'CourseID',
        'Amount',
        'PayDate',
        'PStatus',
        'TransactionRef',
    ];

    protected $casts = [
        'Amount'  => 'float',
        // Format chuẩn cho API; nếu muốn chuỗi Y-m-d H:i:s luôn, dùng 'datetime:Y-m-d H:i:s'
        'PayDate' => 'datetime',
    ];

    // ====== (THÊM MỚI) QUAN HỆ ======
    public function account()
    {
        // Bảng accounts dùng khóa AccountID (xem ảnh bạn gửi)
        return $this->belongsTo(Account::class, 'AccountID', 'AccountID');
    }

    public function course()
    {
        // Bảng courses dùng khóa CourseID
        return $this->belongsTo(Course::class, 'CourseID', 'CourseID');
    }

    // ====== (THÊM MỚI) ACCESSORS CHO DASHBOARD/API ======
    /**
     * Tên người thanh toán (đọc từ quan hệ account)
     */
    public function getPayerNameAttribute(): ?string
    {
        return $this->account->AName ?? null;
    }

    /**
     * Tiêu đề khóa học (đọc từ quan hệ course)
     */
    public function getCourseTitleAttribute(): ?string
    {
        return $this->course->Title ?? null;
    }

    /**
     * Nhãn trạng thái thanh toán chuẩn hoá cho FE
     * (giữ nguyên PStatus nếu không map được)
     */
    public function getStatusLabelAttribute(): string
    {
        $raw = strtolower((string)($this->PStatus ?? ''));
        return match ($raw) {
            'paid', 'success', 'completed'   => 'Paid',
            'processing', 'pending', 'wait'  => 'Processing',
            'refunded', 'refund'             => 'Refunded',
            'failed', 'error'                => 'Failed',
            'canceled', 'cancelled'          => 'Canceled',
            default                          => ucfirst($raw),
        };
    }

    /**
     * Chuẩn hoá hiển thị PayDate theo định dạng Y-m-d H:i:s (nếu muốn)
     */
    public function getPayDateFormattedAttribute(): ?string
    {
        if (!$this->PayDate) return null;
        try {
            return $this->PayDate->format('Y-m-d H:i:s');
        } catch (\Throwable $e) {
            return (string) $this->PayDate;
        }
    }

    // ====== (THÊM MỚI) APPENDS: tự động thêm các field ảo vào JSON ======
    protected $appends = [
        'payer_name',       // => getPayerNameAttribute
        'course_title',     // => getCourseTitleAttribute
        'status_label',     // => getStatusLabelAttribute
        'pay_date_formatted', // => getPayDateFormattedAttribute
    ];

    // ====== (THÊM MỚI) SCOPES HỮU ÍCH ======
    /**
     * Lấy N payment mới nhất theo PaymentID (dùng cho dashboard)
     */
    public function scopeLatestById($query, int $limit = 5)
    {
        return $query->orderByDesc('PaymentID')->limit($limit);
    }

    /**
     * Scope cho dashboard: kèm quan hệ tối thiểu để trả tên hiển thị
     */
    public function scopeForDashboard($query)
    {
        return $query->with([
            'account:AccountID,AName',
            'course:CourseID,Title',
        ]);
    }
}
