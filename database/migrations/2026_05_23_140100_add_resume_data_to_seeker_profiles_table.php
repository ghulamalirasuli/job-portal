<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class () extends Migration {
    public function up(): void
    {
        Schema::table('seeker_profiles', function (Blueprint $table): void {
            $table->json('resume_data')->nullable()->after('visibility');
        });
    }

    public function down(): void
    {
        Schema::table('seeker_profiles', function (Blueprint $table): void {
            $table->dropColumn('resume_data');
        });
    }
};
