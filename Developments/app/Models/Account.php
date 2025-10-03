<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Notifications\Notifiable;

class Account extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $table = 'accounts';
    protected $primaryKey = 'AccountID';
    public $incrementing = false;
    protected $keyType = 'string';

    // Timestamps: chỉ có CreatedAt
    public $timestamps = true;
    const CREATED_AT = 'CreatedAt';
    const UPDATED_AT = null;

    // KHÔNG cho client ghi đè CreatedAt
    protected $fillable = [
        'AccountID',
        'AName',
        'Email',
        'Pass',
        'ARole',
        'AStatus',
        'ApprovalStatus',
        'Avatar',
    ];

    protected $hidden = ['Pass'];

    // Trả CreatedAt dạng datetime (ISO khi toArray/toJson)
    protected $casts = [
        'CreatedAt' => 'datetime',
    ];

    // Giá trị mặc định avatar
    protected $attributes = [
        'Avatar' => 'avatars/avatar.jpg',
    ];

    // Luôn append url đầy đủ của avatar vào JSON
    protected $appends = [
        'avatarUrl',
        // (thêm mới)
        'status_label',
        'role_label',
    ];

    public function getAvatarUrlAttribute(): string
    {
        $path = $this->Avatar ?: 'avatars/avatar.jpg';
        return asset('storage/' . $path);
    }

    // Cho Sanctum dùng cột Pass làm password
    public function getAuthPassword()
    {
        return $this->Pass;
    }

    /* ========= THÊM MỚI: QUAN HỆ ========= */

    // Nếu bạn có bảng payments (theo Payment model đã cấu hình)
    public function payments()
    {
        return $this->hasMany(Payment::class, 'AccountID', 'AccountID');
    }

    // Nếu có bảng enrollments
    public function enrollments()
    {
        return $this->hasMany(Enrollment::class, 'AccountID', 'AccountID');
    }

    // Tùy dự án, nếu có:
    public function submissions()
    {
        return $this->hasMany(Submission::class, 'AccountID', 'AccountID');
    }

    public function results()
    {
        return $this->hasMany(Result::class, 'AccountID', 'AccountID');
    }

    /* ========= THÊM MỚI: ACCESSORS ========= */

    public function getStatusLabelAttribute(): string
    {
        $s = strtolower((string)($this->AStatus ?? ''));
        return match ($s) {
            'active', 'approved', 'enable', 'enabled', '1' => 'Active',
            'inactive', 'disabled', 'blocked', 'banned', '0' => 'Inactive',
            default => $this->AStatus ? (string)$this->AStatus : '',
        };
    }

    public function getRoleLabelAttribute(): string
    {
        $r = strtolower((string)($this->ARole ?? ''));
        return match ($r) {
            'admin'      => 'Admin',
            'instructor' => 'Instructor',
            'learner', 'student' => 'Learner',
            default      => $this->ARole ? (string)$this->ARole : '',
        };
    }

    /* ========= THÊM MỚI: SCOPES ========= */

    // Chỉ lấy các cột cần thiết cho dashboard + order mới nhất
    public function scopeForDashboard($query)
    {
        return $query->select(['AccountID','AName','ARole','AStatus','CreatedAt']);
    }

    public function scopeLatestForDashboard($query, int $limit = 4)
    {
        return $this->scopeForDashboard($query)->orderByDesc('AccountID')->limit($limit);
    }
}
