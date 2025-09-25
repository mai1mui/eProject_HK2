<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Result extends Model
{
    use HasFactory;

    protected $table = 'results';
    protected $primaryKey = 'ResultID';
    public $incrementing = false;       // Nếu ResultID là string (VD: "RS001")
    protected $keyType = 'string';
    public $timestamps = false;         // Nếu bảng không có created_at, updated_at

    protected $fillable = [
        'ResultID',
        'LearnerName',
        'CourseID',
        'ExamName',
        'Score',
        'RStatus'
    ];
}
