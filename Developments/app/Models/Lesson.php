<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Lesson extends Model
{
    use HasFactory;

    protected $table = 'lessons';
    protected $primaryKey = 'LessonID';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'LessonID',
        'CourseID',
        'LName',
        'Content',
        'LessonType',
        'Ordinal',
        'CreatedAt',
        'LStatus'
    ];

    public $timestamps = false; // vì bảng không có created_at, updated_at mặc định
}
