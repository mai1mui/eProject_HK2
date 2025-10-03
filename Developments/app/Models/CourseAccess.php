<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CourseAccess extends Model
{
    protected $table = 'course_accesses';

    public $timestamps = false;

    protected $fillable = [
        'AccountID', 'CourseID', 'GrantedAt',
    ];

    protected $casts = [
        'GrantedAt' => 'datetime',
    ];
}
