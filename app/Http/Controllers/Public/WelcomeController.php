<?php

declare(strict_types=1);

namespace App\Http\Controllers\Public;

use App\Enums\JobStatus;
use App\Http\Controllers\Controller;
use App\Models\EmployerProfile;
use App\Models\JobPosting;
use Inertia\Inertia;
use Inertia\Response;

class WelcomeController extends Controller
{
    public function __invoke(): Response
    {
        $featuredJobs = JobPosting::query()
            ->with(['employerProfile'])
            ->where('status', JobStatus::Approved)
            ->where('is_active', true)
            ->latest('published_at')
            ->limit(6)
            ->get()
            ->map(fn (JobPosting $job): array => JobListingController::serializeJobCard($job))
            ->all();

        return Inertia::render('Welcome', [
            'stats' => [
                'jobs' => JobPosting::query()
                    ->where('status', JobStatus::Approved)
                    ->where('is_active', true)
                    ->count(),
                'companies' => EmployerProfile::query()->whereNotNull('verified_at')->count(),
                'countries' => EmployerProfile::query()->whereNotNull('country')->distinct('country')->count('country') ?: 27,
            ],
            'featuredJobs' => $featuredJobs,
        ]);
    }
}
