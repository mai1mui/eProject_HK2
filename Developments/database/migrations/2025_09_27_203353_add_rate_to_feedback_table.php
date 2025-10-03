<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        // chỉ thêm nếu CHƯA có cột
        if (!Schema::hasColumn('feedback', 'Rate')) {
            Schema::table('feedback', function (Blueprint $table) {
                $table->unsignedTinyInteger('Rate')
                      ->nullable()
                      ->comment('1..5 stars')
                      ->after('AccountID');
            });
        }
    }

    public function down(): void
    {
        // chỉ xoá nếu ĐANG có cột
        if (Schema::hasColumn('feedback', 'Rate')) {
            Schema::table('feedback', function (Blueprint $table) {
                $table->dropColumn('Rate');
            });
        }
    }
};

