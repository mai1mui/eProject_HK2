<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    use HasFactory;

    protected $table = 'payments';
    protected $primaryKey = 'PaymentID';
    public $incrementing = false;   // PaymentID dạng string (#123456,…)
    protected $keyType = 'string';
    public $timestamps = false;

    protected $fillable = [
        'PaymentID',
        'AccountID',
        'CourseID',
        'Amount',
        'PDate',
        'PStatus',
        'TransactionRef'
    ];

    public function account()
    {
        return $this->belongsTo(Account::class, 'AccountID', 'AccountID');
    }

    public function course()
    {
        return $this->belongsTo(Course::class, 'CourseID', 'CourseID');
    }
}
