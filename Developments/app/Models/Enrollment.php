<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Enrollment extends Model
{
    use HasFactory;

    protected $table = 'enrollments';
    protected $primaryKey = 'EnrollmentID';
    public $incrementing = false; // vì ID là varchar
    protected $keyType = 'string';
    public $timestamps = false;   // vì không có created_at, updated_at mặc định

    protected $fillable = [
        'EnrollmentID',
        'AccountID',
        'CourseID',
        'EnrollDate',
        'EStatus',
    ];

    // Quan hệ
    public function learner()
    {
        return $this->belongsTo(Account::class, 'AccountID', 'AccountID');
    }

    public function course()
    {
        return $this->belongsTo(Course::class, 'CourseID', 'CourseID');
    }
}
