<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Lesson extends Model
{
    protected $table = 'lessons';
    protected $primaryKey = 'LessonID';
    public $incrementing = false;
    protected $keyType = 'string';

    // Timestamps: chỉ dùng CreatedAt
    public $timestamps = true;
    const CREATED_AT = 'CreatedAt';
    const UPDATED_AT = null;

    // Không cho client tự set CreatedAt
    protected $fillable = [
        'LessonID','CourseID','LName','Content','LessonType','Ordinal','LStatus',
    ];

    protected $casts = [
        'CreatedAt' => 'datetime',
        'Ordinal'   => 'integer',
    ];

    public function course()
    {
        return $this->belongsTo(\App\Models\Course::class, 'CourseID', 'CourseID');
    }
}
