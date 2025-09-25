<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Feedback extends Model
{
    use HasFactory;

    protected $table = 'feedback';
    protected $primaryKey = 'FeedbackID';
    public $incrementing = false; // FeedbackID là string (FE01...)
    protected $keyType = 'string';
    public $timestamps = false;

    protected $fillable = [
        'FeedbackID',
        'AccountID',
        'Content',
        'Rate',
        'FStatus',
        'CreatedAt',
        'AdminReply', // thêm trường trả lời
    ];

    public function account()
    {
        return $this->belongsTo(Account::class, 'AccountID', 'AccountID');
    }
}
