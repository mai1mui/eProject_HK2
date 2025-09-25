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
    protected $appends = ['avatarUrl'];

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
}
