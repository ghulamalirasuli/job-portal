<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Enums\EmploymentType;
use App\Enums\JobStatus;
use App\Enums\PaymentStatus;
use App\Enums\RemoteType;
use App\Enums\UserRole;
use App\Models\EmployerProfile;
use App\Models\JobPosting;
use App\Models\SeekerProfile;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DevUsersSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::updateOrCreate(
            ['email' => 'admin@europa.jobs'],
            [
                'name' => 'Admin',
                'password' => Hash::make('password'),
                'role' => UserRole::Admin,
                'locale' => 'en',
                'email_verified_at' => now(),
            ],
        );
        $admin->syncRoles([UserRole::Admin->value]);

        $employer = User::updateOrCreate(
            ['email' => 'employer@example.com'],
            [
                'name' => 'Anya Müller',
                'password' => Hash::make('password'),
                'role' => UserRole::Employer,
                'locale' => 'de',
                'email_verified_at' => now(),
            ],
        );
        $employer->syncRoles([UserRole::Employer->value]);
        $profile = EmployerProfile::updateOrCreate(
            ['user_id' => $employer->id],
            [
                'company_name' => 'Berlin TechWorks GmbH',
                'company_size' => '51-200',
                'industry' => 'Software',
                'country' => 'DE',
                'website' => 'https://example.com',
                'description' => 'A demo company used for local development.',
                'verified_at' => now(),
            ],
        );

        JobPosting::updateOrCreate(
            ['slug' => 'senior-backend-engineer-berlin'],
            [
                'employer_profile_id' => $profile->id,
                'user_id' => $employer->id,
                'title' => 'Senior Backend Engineer',
                'description' => 'Build scalable APIs for our EU hiring platform. Laravel, MySQL, Redis.',
                'requirements' => '5+ years PHP/Laravel. Strong SQL and testing culture.',
                'benefits' => 'Remote-friendly, 30 days leave, learning budget.',
                'location' => 'Berlin',
                'country' => 'DE',
                'remote_type' => RemoteType::Hybrid->value,
                'employment_type' => EmploymentType::FullTime->value,
                'salary_min' => 70000,
                'salary_max' => 95000,
                'salary_currency' => 'EUR',
                'salary_period' => 'yearly',
                'status' => JobStatus::Approved->value,
                'is_active' => true,
                'payment_amount' => 149.00,
                'payment_currency' => 'EUR',
                'payment_status' => PaymentStatus::Paid->value,
                'payment_reference' => 'pi_demo_berlin_techworks',
                'payment_method' => 'stripe',
                'approved_at' => now(),
                'published_at' => now(),
                'expires_at' => now()->addDays(30),
            ],
        );

        JobPosting::updateOrCreate(
            ['slug' => 'product-designer-paris-pending'],
            [
                'employer_profile_id' => $profile->id,
                'user_id' => $employer->id,
                'title' => 'Product Designer',
                'description' => 'Shape the employer and job seeker experience across web and mobile.',
                'location' => 'Paris',
                'country' => 'FR',
                'remote_type' => RemoteType::Remote->value,
                'employment_type' => EmploymentType::FullTime->value,
                'salary_min' => 55000,
                'salary_max' => 72000,
                'status' => JobStatus::PendingApproval->value,
                'is_active' => false,
                'payment_amount' => 99.00,
                'payment_currency' => 'EUR',
                'payment_status' => PaymentStatus::Pending->value,
                'payment_method' => 'stripe',
                'expires_at' => now()->addDays(30),
            ],
        );

        $seeker = User::updateOrCreate(
            ['email' => 'seeker@example.com'],
            [
                'name' => 'Lucas Martin',
                'password' => Hash::make('password'),
                'role' => UserRole::JobSeeker,
                'locale' => 'fr',
                'email_verified_at' => now(),
            ],
        );
        $seeker->syncRoles([UserRole::JobSeeker->value]);
        SeekerProfile::updateOrCreate(
            ['user_id' => $seeker->id],
            [
                'headline' => 'Backend Engineer · Paris',
                'location' => 'Paris',
                'country' => 'FR',
                'visibility' => 'public',
            ],
        );
    }
}
