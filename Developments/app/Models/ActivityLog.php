<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ActivityLog extends Model
{
    protected $table = 'activity_logs';
    public $timestamps = false;              // dùng cột created_at tự tay
    protected $fillable = ['AccountID','action','meta','ip','agent','created_at'];
    protected $casts = ['meta' => 'array','created_at' => 'datetime',];

    // Tiện: 1 method ghi log
    public static function record(string $accountId, string $action, array $meta = []): void
    {
        static::create([
            'AccountID' => $accountId,
            'action'    => $action,
            'meta'      => $meta ?: null,
            'ip'        => request()->ip(),
            'agent'     => substr((string) request()->userAgent(), 0, 512),
            'created_at'=> now(),
        ]);
    }
}
