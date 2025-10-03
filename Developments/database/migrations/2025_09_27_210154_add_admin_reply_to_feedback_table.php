<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        if (!Schema::hasColumn('feedback', 'AdminReply')) {
            Schema::table('feedback', function (Blueprint $table) {
                // tuỳ vị trí bạn muốn; sau Content hoặc sau FStatus đều được
                $table->text('AdminReply')->nullable()->after('FStatus');
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasColumn('feedback', 'AdminReply')) {
            Schema::table('feedback', function (Blueprint $table) {
                $table->dropColumn('AdminReply');
            });
        }
    }
};

