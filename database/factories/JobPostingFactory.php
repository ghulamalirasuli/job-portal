<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Enums\EmploymentType;
use App\Enums\JobStatus;
use App\Enums\PaymentStatus;
use App\Enums\RemoteType;
use App\Models\EmployerProfile;
use App\Models\JobPosting;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<JobPosting>
 */
class JobPostingFactory extends Factory
{
    protected $model = JobPosting::class;

    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $title = fake()->jobTitle();

        return [
            'title' => $title,
            'slug' => JobPosting::uniqueSlug($title),
            'description' => fake()->paragraphs(3, true),
            'requirements' => fake()->paragraph(),
            'benefits' => fake()->sentence(),
            'location' => fake()->city(),
            'country' => fake()->countryCode(),
            'remote_type' => RemoteType::Hybrid->value,
            'employment_type' => EmploymentType::FullTime->value,
            'salary_min' => 45000,
            'salary_max' => 65000,
            'salary_currency' => 'EUR',
            'salary_period' => 'yearly',
            'status' => JobStatus::PendingApproval->value,
            'is_active' => false,
            'payment_amount' => 99.00,
            'payment_currency' => 'EUR',
            'payment_status' => PaymentStatus::Paid->value,
            'payment_reference' => fake()->uuid(),
            'payment_method' => 'stripe',
            'expires_at' => now()->addDays(30),
        ];
    }

    public function forEmployer(User $user): static
    {
        return $this->state(function () use ($user): array {
            $profile = $user->employerProfile ?? $user->employerProfile()->create([
                'company_name' => fake()->company(),
                'country' => fake()->countryCode(),
            ]);

            return [
                'employer_profile_id' => $profile->id,
                'user_id' => $user->id,
            ];
        });
    }

    public function approved(): static
    {
        return $this->state(fn (array $attributes): array => [
            'status' => JobStatus::Approved->value,
            'is_active' => true,
            'approved_at' => now(),
            'published_at' => now(),
        ]);
    }

    public function configure(): static
    {
        return $this->afterMaking(function (JobPosting $job): void {
            if ($job->employer_profile_id === null || $job->user_id !== null) {
                return;
            }

            $profile = EmployerProfile::query()->find($job->employer_profile_id);
            if ($profile !== null) {
                $job->user_id = $profile->user_id;
            }
        })->afterCreating(function (JobPosting $job): void {
            if ($job->employer_profile_id !== null && $job->user_id !== null) {
                return;
            }

            $employer = User::factory()->employer()->create();
            $profile = $employer->employerProfile;
            $job->forceFill([
                'employer_profile_id' => $profile->id,
                'user_id' => $employer->id,
            ])->saveQuietly();
        });
    }
}
