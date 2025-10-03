<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Result extends Model
{
  protected $table = 'results';
    protected $primaryKey = 'id';
    public $incrementing = true;
    protected $keyType = 'int';
    public $timestamps = false;

    protected $fillable = ['AccountID','CourseID','Content','Mark','RStatus']; // ResultCode set trong code
    protected $casts = ['Mark' => 'float'];
}
