<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('activity_logs', function (Blueprint $table) {
            $table->id();

            // nếu AccountID kiểu string (VD: LRN001), đặt độ dài hợp lý
            $table->string('AccountID', 20)->index();

            $table->string('action', 191);      // login, avatar.update, profile.update, ...
            $table->json('meta')->nullable();   // dữ liệu phụ (JSON)
            $table->string('ip', 45)->nullable();
            $table->string('agent', 512)->nullable();

            // chỉ cần created_at, không cần updated_at
            $table->timestamp('created_at')->useCurrent()->index();

            // Nếu muốn ràng buộc FK (tuỳ chọn, bỏ nếu DB khác collation/length)
            // $table->foreign('AccountID')
            //       ->references('AccountID')->on('accounts')
            //       ->cascadeOnDelete();
        });
    }

    public function down(): void {
        Schema::dropIfExists('activity_logs');
    }
};
