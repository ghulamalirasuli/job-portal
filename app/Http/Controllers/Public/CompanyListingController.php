<?php

declare(strict_types=1);

namespace App\Http\Controllers\Public;

use App\Enums\JobStatus;
use App\Http\Controllers\Controller;
use App\Models\EmployerProfile;
use App\Models\JobPosting;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CompanyListingController extends Controller
{
    public function index(Request $request): Response
    {
        $validated = $request->validate([
            'q' => ['nullable', 'string', 'max:120'],
            'country' => ['nullable', 'string', 'size:2'],
            'page' => ['nullable', 'integer', 'min:1'],
        ]);

        $query = EmployerProfile::query()
            ->with(['user'])
            ->whereHas('user', fn ($u) => $u->where('is_active', true))
            ->whereNotNull('verified_at');

        if (! empty($validated['q'])) {
            $term = '%' . $validated['q'] . '%';
            $query->where(function ($q) use ($term): void {
                $q->where('company_name', 'like', $term)
                    ->orWhere('industry', 'like', $term);
            });
        }

        if (! empty($validated['country'])) {
            $query->where('country', mb_strtoupper($validated['country']));
        }

        $companies = $query
            ->withCount([
                'jobPostings as active_jobs_count' => fn ($q) => $q
                    ->where('status', JobStatus::Approved)
                    ->where('is_active', true),
            ])
            ->orderBy('company_name')
            ->paginate(12)
            ->withQueryString()
            ->through(fn (EmployerProfile $p): array => [
                'id' => $p->id,
                'company_name' => $p->company_name,
                'industry' => $p->industry,
                'country' => $p->country,
                'company_size' => $p->company_size,
                'logo_url' => $p->logoUrl(),
                'description' => $p->description,
                'website' => $p->website,
                'active_jobs_count' => $p->active_jobs_count,
                'is_verified' => $p->isVerified(),
            ]);

        return Inertia::render('Public/Companies/Index', [
            'companies' => $companies,
            'filters' => [
                'q' => $validated['q'] ?? '',
                'country' => $validated['country'] ?? '',
            ],
        ]);
    }

    public function show(int $id): Response
    {
        /** @var EmployerProfile $company */
        $company = EmployerProfile::query()
            ->with(['user'])
            ->whereHas('user', fn ($u) => $u->where('is_active', true))
            ->findOrFail($id);

        $jobs = JobPosting::query()
            ->where('employer_profile_id', $company->id)
            ->where('status', JobStatus::Approved)
            ->where('is_active', true)
            ->latest('published_at')
            ->limit(20)
            ->get()
            ->map(fn (JobPosting $job): array => JobListingController::serializeJobCard($job))
            ->all();

        return Inertia::render('Public/Companies/Show', [
            'company' => [
                'id' => $company->id,
                'company_name' => $company->company_name,
                'industry' => $company->industry,
                'country' => $company->country,
                'company_size' => $company->company_size,
                'logo_url' => $company->logoUrl(),
                'description' => $company->description,
                'website' => $company->website,
                'is_verified' => $company->isVerified(),
            ],
            'jobs' => $jobs,
        ]);
    }
}
