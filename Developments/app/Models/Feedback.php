<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Feedback extends Model
{
    // Bảng đúng tên (không phải "feedbacks")
    protected $table = 'feedback';

    // Không dùng timestamps mặc định của Laravel
    public $timestamps = false;

    // Khóa chính là chuỗi (vd: F001), không auto-increment
    protected $primaryKey = 'FeedbackID';
    public $incrementing = false;
    protected $keyType = 'string';

    // Cho phép gán hàng loạt
    protected $fillable = [
        'FeedbackID',
        'AccountID',
        'Content',
        'Rate',
        'FStatus',
        'AdminReply',
        'CreatedAt',
    ];

    // Ép kiểu
    protected $casts = [
        'Rate'      => 'integer',
        'CreatedAt' => 'datetime', // nếu cột là DATETIME; giữ nguyên nếu là VARCHAR
    ];

    // Quan hệ tới Account (nếu có model Account)
    public function account()
    {
        return $this->belongsTo(Account::class, 'AccountID', 'AccountID');
    }
}
