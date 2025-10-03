<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('course_accesses', function (Blueprint $table) {
            $table->id();
            $table->string('AccountID', 50);
            $table->string('CourseID', 50);
            $table->timestamp('GrantedAt')->nullable();

            $table->unique(['AccountID', 'CourseID'], 'course_accesses_account_course_unique');

            // Nếu bạn có bảng accounts/courses với key phù hợp, có thể bật foreign key:
            // $table->foreign('AccountID')->references('AccountID')->on('accounts')->cascadeOnDelete();
            // $table->foreign('CourseID')->references('CourseID')->on('courses')->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('course_accesses');
    }
};
