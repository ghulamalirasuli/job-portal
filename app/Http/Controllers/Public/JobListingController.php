<?php

declare(strict_types=1);

namespace App\Http\Controllers\Public;

use App\Enums\JobStatus;
use App\Http\Controllers\Controller;
use App\Models\JobPosting;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class JobListingController extends Controller
{
    public function index(Request $request): Response
    {
        $validated = $request->validate([
            'q' => ['nullable', 'string', 'max:120'],
            'location' => ['nullable', 'string', 'max:120'],
            'country' => ['nullable', 'string', 'size:2'],
            'remote_type' => ['nullable', 'string', 'max:32'],
            'employment_type' => ['nullable', 'string', 'max:32'],
            'page' => ['nullable', 'integer', 'min:1'],
        ]);

        $query = JobPosting::query()
            ->with(['employerProfile'])
            ->where('status', JobStatus::Approved)
            ->where('is_active', true)
            ->where(function ($q): void {
                $q->whereNull('expires_at')->orWhere('expires_at', '>=', now());
            });

        if (! empty($validated['q'])) {
            $term = '%' . $validated['q'] . '%';
            $query->where(function ($q) use ($term): void {
                $q->where('title', 'like', $term)
                    ->orWhere('description', 'like', $term)
                    ->orWhereHas('employerProfile', fn ($e) => $e->where('company_name', 'like', $term));
            });
        }

        if (! empty($validated['location'])) {
            $query->where('location', 'like', '%' . $validated['location'] . '%');
        }

        if (! empty($validated['country'])) {
            $query->where('country', mb_strtoupper($validated['country']));
        }

        if (! empty($validated['remote_type'])) {
            $query->where('remote_type', $validated['remote_type']);
        }

        if (! empty($validated['employment_type'])) {
            $query->where('employment_type', $validated['employment_type']);
        }

        $jobs = $query
            ->latest('published_at')
            ->paginate(12)
            ->withQueryString()
            ->through(fn (JobPosting $job): array => $this->serializeJobCard($job));

        return Inertia::render('Public/Jobs/Index', [
            'jobs' => $jobs,
            'filters' => [
                'q' => $validated['q'] ?? '',
                'location' => $validated['location'] ?? '',
                'country' => $validated['country'] ?? '',
                'remote_type' => $validated['remote_type'] ?? '',
                'employment_type' => $validated['employment_type'] ?? '',
            ],
            'total_active' => JobPosting::query()
                ->where('status', JobStatus::Approved)
                ->where('is_active', true)
                ->count(),
        ]);
    }

    public function show(string $slug): Response
    {
        /** @var JobPosting $job */
        $job = JobPosting::query()
            ->with(['employerProfile', 'user'])
            ->where('slug', $slug)
            ->where('status', JobStatus::Approved)
            ->where('is_active', true)
            ->firstOrFail();

        $job->increment('views_count');

        $profile = $job->employerProfile;

        return Inertia::render('Public/Jobs/Show', [
            'job' => [
                'id' => $job->id,
                'title' => $job->title,
                'slug' => $job->slug,
                'description' => $job->description,
                'requirements' => $job->requirements,
                'benefits' => $job->benefits,
                'location' => $job->location,
                'country' => $job->country,
                'remote_type' => $job->remote_type->value,
                'remote_label' => $job->remote_type->label(),
                'employment_type' => $job->employment_type->value,
                'employment_label' => $job->employment_type->label(),
                'salary_label' => $job->formattedSalary(),
                'expires_at' => $job->expires_at?->toIso8601String(),
                'published_at' => $job->published_at?->toIso8601String(),
                'views_count' => $job->views_count,
                'company' => [
                    'id' => $profile->id,
                    'name' => $profile->company_name,
                    'logo_url' => $profile->logoUrl(),
                    'industry' => $profile->industry,
                    'website' => $profile->website,
                    'is_verified' => $profile->isVerified(),
                    'country' => $profile->country,
                ],
            ],
        ]);
    }

    /**
     * @return array<string, mixed>
     */
    public static function serializeJobCard(JobPosting $job): array
    {
        $profile = $job->employerProfile;

        return [
            'id' => $job->id,
            'title' => $job->title,
            'slug' => $job->slug,
            'location' => $job->location,
            'country' => $job->country,
            'remote_type' => $job->remote_type->value,
            'remote_label' => $job->remote_type->label(),
            'employment_type' => $job->employment_type->value,
            'employment_label' => $job->employment_type->label(),
            'salary_label' => $job->formattedSalary(),
            'expires_at' => $job->expires_at?->toIso8601String(),
            'published_at' => $job->published_at?->toIso8601String(),
            'company_name' => $profile->company_name,
            'company_logo' => $profile->logoUrl(),
            'company_verified' => $profile->isVerified(),
            'industry' => $profile->industry,
        ];
    }
}
