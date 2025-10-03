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
    $exists = fn($name) => DB::table('information_schema.statistics')
        ->where('table_schema', DB::getDatabaseName())
        ->where('table_name', 'lessons')
        ->where('index_name', $name)
        ->exists();

    if (!$exists('lessons_course_type_idx')) {
        Schema::table('lessons', function (Blueprint $t) {
            $t->index(['CourseID','LessonType'], 'lessons_course_type_idx');
        });
    }
    if (!$exists('lessons_course_ordinal_idx')) {
        Schema::table('lessons', function (Blueprint $t) {
            $t->index(['CourseID','Ordinal'], 'lessons_course_ordinal_idx');
        });
    }
    if (!$exists('lessons_status_idx')) {
        Schema::table('lessons', function (Blueprint $t) {
            $t->index('LStatus', 'lessons_status_idx');
        });
    }
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('lessons', function (Blueprint $table) {
            //
        });
    }
};
