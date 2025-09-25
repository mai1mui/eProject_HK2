<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
     Schema::create('notifications', function (Blueprint $table) {
    $table->uuid('id')->primary();

    // ⚠️ ĐỔI từ: $table->morphs('notifiable');
    // SANG:
    $table->string('notifiable_type');
    $table->string('notifiable_id');
    $table->index(['notifiable_type','notifiable_id']);

    $table->string('type');
    $table->text('data');           // hoặc $table->json('data'); nếu MySQL support JSON OK
    $table->timestamp('read_at')->nullable();
    $table->timestamps();
});
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('notifications');
    }
};
