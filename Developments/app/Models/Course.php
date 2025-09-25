<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Course extends Model
{
    use HasFactory;

    protected $table = 'courses';
    protected $primaryKey = 'CourseID';
    public $incrementing = false;
    protected $keyType = 'string';
    public $timestamps = false;

    protected $fillable = [
        'CourseID',
        'CName',
        'CDescription',
        'StartDate',
        'CreatorID',
        'CreatedAt',
        'CStatus',
    ];

    // 1 course có thể có nhiều enrollment
    public function enrollments()
    {
        return $this->hasMany(Enrollment::class, 'CourseID', 'CourseID');
    }
}
