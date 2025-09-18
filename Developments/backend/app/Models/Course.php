<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Course extends Model
{
    protected $table = 'courses';
    protected $primaryKey = 'CourseID';
    public $timestamps = false; // vì bảng bạn đã có CreatedAt

    protected $fillable = [
        'CourseID',
        'CName',
        'CDescription',
        'StartDate',
        'CreatorID',
        'CreatedAt',
        'CStatus'
    ];
}
