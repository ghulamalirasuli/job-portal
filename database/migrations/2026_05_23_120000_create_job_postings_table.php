<?php

declare(strict_types=1);

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class () extends Migration {
    public function up(): void
    {
        Schema::create('job_postings', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('employer_profile_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('description');
            $table->text('requirements')->nullable();
            $table->text('benefits')->nullable();
            $table->string('location')->nullable();
            $table->string('country', 2)->nullable()->index();
            $table->string('remote_type', 32)->default('on_site')->index();
            $table->string('employment_type', 32)->default('full_time')->index();
            $table->unsignedInteger('salary_min')->nullable();
            $table->unsignedInteger('salary_max')->nullable();
            $table->string('salary_currency', 3)->default('EUR');
            $table->string('salary_period', 16)->default('yearly');
            $table->string('status', 32)->default('pending_approval')->index();
            $table->text('rejection_reason')->nullable();
            $table->boolean('is_active')->default(false)->index();
            $table->decimal('payment_amount', 10, 2)->nullable();
            $table->string('payment_currency', 3)->default('EUR');
            $table->string('payment_status', 32)->default('unpaid')->index();
            $table->string('payment_reference')->nullable();
            $table->string('payment_method', 64)->nullable();
            $table->timestamp('approved_at')->nullable();
            $table->foreignId('approved_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('rejected_at')->nullable();
            $table->foreignId('rejected_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('published_at')->nullable();
            $table->timestamp('expires_at')->nullable()->index();
            $table->unsignedInteger('views_count')->default(0);
            $table->softDeletes();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('job_postings');
    }
};
