<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Submission extends Model
{
    use HasFactory;

    protected $table = 'submissions';
    protected $primaryKey = 'SubID';
    public $incrementing = false; // vì SubID là varchar
    protected $keyType = 'string';
    public $timestamps = false;

    protected $fillable = [
        'SubID',
        'AccountID',
        'CourseID',
        'Answer',
        'Mark',
        'Feedback',
        'SDate',
        'SStatus',
    ];

    // Quan hệ
    public function account()
    {
        return $this->belongsTo(Account::class, 'AccountID', 'AccountID');
    }

    public function course()
    {
        return $this->belongsTo(Course::class, 'CourseID', 'CourseID');
    }
}
