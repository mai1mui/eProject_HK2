<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Course extends Model
{
    protected $table = 'courses';
    protected $primaryKey = 'CourseID';
    public $incrementing = false;
    protected $keyType = 'string';

    // map cột thời gian tuỳ biến
    public $timestamps = true;
    const CREATED_AT = 'CreatedAt';
    const UPDATED_AT = null;

    protected $fillable = [
        'CourseID','CName','CDescription','StartDate','CreatorID','CStatus','CreatedAt'
    ];

    protected $casts = [
        'StartDate' => 'date:Y-m-d',
        'CreatedAt' => 'datetime',
    ];

    // ====== (THÊM) Appends để trả kèm label ra JSON ======
    protected $appends = [
        'status_label',
        // Không append 'Title' vì accessor tự hoạt động khi truy cập $course->Title
    ];

    /* =======================
     * Quan hệ
     * ======================= */

    /**
     * Đếm số enrollment theo CourseID.
     * Đổi tên model/foreign key nếu hệ thống bạn khác.
     */
    public function enrollments()
    {
        return $this->hasMany(Enrollment::class, 'CourseID', 'CourseID');
    }

    /**
     * (Tuỳ chọn) Người tạo khoá học nếu bạn có bảng accounts.
     */
    public function creator()
    {
        return $this->belongsTo(Account::class, 'CreatorID', 'AccountID');
    }

    /* =======================
     * Accessors / Aliases
     * ======================= */

    /**
     * Alias Title = CName để API/FE có thể dùng 'Title' mà không cần sửa DB.
     */
    public function getTitleAttribute(): ?string
    {
        return $this->CName;
    }

    /**
     * Chuẩn hoá trạng thái hiển thị cho FE từ CStatus.
     */
    public function getStatusLabelAttribute(): string
    {
        $s = strtolower((string)($this->CStatus ?? ''));
        return match ($s) {
            'active', 'published', '1'  => 'Active',
            'inactive', 'draft', '0'    => 'Inactive',
            'archived', 'archive', '2'  => 'Archived',
            default => $this->CStatus ? (string)$this->CStatus : '',
        };
    }

    /* =======================
     * Scopes tiện dụng
     * ======================= */

    /**
     * Chỉ lấy các cột cần cho dashboard.
     */
    public function scopeForDashboard($query)
    {
        return $query->select(['CourseID', 'CName', 'CStatus', 'CreatedAt']);
    }

    /**
     * Top theo enrollments_count (dùng kèm withCount('enrollments')).
     */
    public function scopeTopByEnrollments($query, int $limit = 5)
    {
        return $query->withCount('enrollments')
                     ->orderByDesc('enrollments_count')
                     ->limit($limit);
    }
}
