<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
   public function up(): void
{
    if (!Schema::hasTable('lessons')) {
        Schema::create('lessons', function (Blueprint $table) {
            $table->string('LessonID', 20)->primary();
            $table->string('CourseID');
            $table->string('LName', 255);
            $table->string('Content', 500)->nullable();
            $table->string('LessonType', 50);
            $table->integer('Ordinal')->default(0);
            $table->string('LStatus', 50)->nullable();
            $table->timestamp('CreatedAt')->useCurrent();
        });
    }
}
    public function down(): void
    {
        Schema::dropIfExists('lessons');
    }
};
