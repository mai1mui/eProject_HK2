<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Account extends Model
{
    use HasFactory;

    protected $table = 'accounts'; // ✅ bảng chính xác trong DB
    protected $primaryKey = 'AccountID';
    public $incrementing = false; // vì AccountID là varchar, không auto-increment
    protected $keyType = 'string';

    protected $fillable = [
        'AccountID',
        'AName',
        'Email',
        'Pass',
        'ARole',
        'AStatus',
    ];

    protected $hidden = [
        'Pass',
    ];
}
