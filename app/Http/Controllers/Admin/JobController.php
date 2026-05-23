<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Enums\EmploymentType;
use App\Enums\JobStatus;
use App\Enums\PaymentStatus;
use App\Enums\RemoteType;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\RejectJobPostingRequest;
use App\Http\Requests\Admin\StoreJobPostingRequest;
use App\Models\AuditLog;
use App\Models\EmployerProfile;
use App\Models\JobPosting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class JobController extends Controller
{
    public function index(Request $request): Response
    {
        $validated = $request->validate([
            'q' => ['nullable', 'string', 'max:120'],
            'status' => ['nullable', 'string', 'in:' . implode(',', JobStatus::values())],
            'payment_status' => ['nullable', 'string', 'in:' . implode(',', PaymentStatus::values())],
            'page' => ['nullable', 'integer', 'min:1'],
        ]);

        $query = JobPosting::query()->with(['employerProfile', 'user']);

        if (! empty($validated['q'])) {
            $term = '%' . $validated['q'] . '%';
            $query->where(function ($q) use ($term): void {
                $q->where('title', 'like', $term)
                    ->orWhere('location', 'like', $term)
                    ->orWhereHas('employerProfile', fn ($e) => $e->where('company_name', 'like', $term));
            });
        }

        if (! empty($validated['status'])) {
            $query->where('status', $validated['status']);
        }

        if (! empty($validated['payment_status'])) {
            $query->where('payment_status', $validated['payment_status']);
        }

        $jobs = $query
            ->latest('created_at')
            ->paginate(15)
            ->withQueryString()
            ->through(fn (JobPosting $job): array => $this->serializeJob($job));

        return Inertia::render('Admin/Jobs/Index', [
            'jobs' => $jobs,
            'filters' => [
                'q' => $validated['q'] ?? '',
                'status' => $validated['status'] ?? '',
                'payment_status' => $validated['payment_status'] ?? '',
            ],
            'statuses' => JobStatus::values(),
            'paymentStatuses' => PaymentStatus::values(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Jobs/Form', [
            'job' => null,
            'companies' => $this->companyOptions(),
            'remoteTypes' => RemoteType::values(),
            'employmentTypes' => EmploymentType::values(),
            'statuses' => JobStatus::values(),
            'paymentStatuses' => PaymentStatus::values(),
        ]);
    }

    public function store(StoreJobPostingRequest $request): RedirectResponse
    {
        $data = $request->validated();
        /** @var EmployerProfile $company */
        $company = EmployerProfile::with('user')->findOrFail($data['employer_profile_id']);

        $job = JobPosting::create([
            'employer_profile_id' => $company->id,
            'user_id' => $company->user_id,
            'title' => $data['title'],
            'slug' => JobPosting::uniqueSlug($data['title']),
            'description' => $data['description'],
            'requirements' => $data['requirements'] ?? null,
            'benefits' => $data['benefits'] ?? null,
            'location' => $data['location'] ?? null,
            'country' => isset($data['country']) ? mb_strtoupper($data['country']) : null,
            'remote_type' => $data['remote_type'],
            'employment_type' => $data['employment_type'],
            'salary_min' => $data['salary_min'] ?? null,
            'salary_max' => $data['salary_max'] ?? null,
            'salary_currency' => $data['salary_currency'] ?? 'EUR',
            'salary_period' => $data['salary_period'] ?? 'yearly',
            'status' => $data['status'] ?? JobStatus::PendingApproval->value,
            'payment_amount' => $data['payment_amount'] ?? null,
            'payment_currency' => $data['payment_currency'] ?? 'EUR',
            'payment_status' => $data['payment_status'] ?? PaymentStatus::Unpaid->value,
            'payment_reference' => $data['payment_reference'] ?? null,
            'payment_method' => $data['payment_method'] ?? null,
            'expires_at' => $data['expires_at'] ?? now()->addDays(30),
            'is_active' => false,
        ]);

        AuditLog::create([
            'event' => 'admin.job.created',
            'user_id' => $company->user_id,
            'ip_address' => $request->ip(),
            'context' => ['job_id' => $job->id],
        ]);

        return redirect()
            ->route('admin.jobs.edit', $job->id)
            ->with('success', __('Job posting created.'));
    }

    public function edit(int $id): Response
    {
        /** @var JobPosting $job */
        $job = JobPosting::with(['employerProfile', 'user', 'approvedByUser', 'rejectedByUser'])
            ->findOrFail($id);

        return Inertia::render('Admin/Jobs/Form', [
            'job' => $this->serializeJobDetail($job),
            'companies' => $this->companyOptions(),
            'remoteTypes' => RemoteType::values(),
            'employmentTypes' => EmploymentType::values(),
            'statuses' => JobStatus::values(),
            'paymentStatuses' => PaymentStatus::values(),
        ]);
    }

    public function update(StoreJobPostingRequest $request, int $id): RedirectResponse
    {
        /** @var JobPosting $job */
        $job = JobPosting::findOrFail($id);
        $data = $request->validated();
        /** @var EmployerProfile $company */
        $company = EmployerProfile::findOrFail($data['employer_profile_id']);

        $job->fill([
            'employer_profile_id' => $company->id,
            'user_id' => $company->user_id,
            'title' => $data['title'],
            'slug' => JobPosting::uniqueSlug($data['title'], $job->id),
            'description' => $data['description'],
            'requirements' => $data['requirements'] ?? null,
            'benefits' => $data['benefits'] ?? null,
            'location' => $data['location'] ?? null,
            'country' => isset($data['country']) ? mb_strtoupper($data['country']) : null,
            'remote_type' => $data['remote_type'],
            'employment_type' => $data['employment_type'],
            'salary_min' => $data['salary_min'] ?? null,
            'salary_max' => $data['salary_max'] ?? null,
            'salary_currency' => $data['salary_currency'] ?? 'EUR',
            'salary_period' => $data['salary_period'] ?? 'yearly',
            'payment_amount' => $data['payment_amount'] ?? null,
            'payment_currency' => $data['payment_currency'] ?? 'EUR',
            'payment_status' => $data['payment_status'] ?? $job->payment_status->value,
            'payment_reference' => $data['payment_reference'] ?? null,
            'payment_method' => $data['payment_method'] ?? null,
            'expires_at' => $data['expires_at'] ?? $job->expires_at,
        ]);

        if (isset($data['status'])) {
            $job->status = JobStatus::from($data['status']);
        }

        $job->save();

        AuditLog::create([
            'event' => 'admin.job.updated',
            'user_id' => $job->user_id,
            'ip_address' => $request->ip(),
            'context' => ['job_id' => $job->id],
        ]);

        return back()->with('success', __('Job posting updated.'));
    }

    public function approve(Request $request, int $id): RedirectResponse
    {
        /** @var JobPosting $job */
        $job = JobPosting::findOrFail($id);

        $job->fill([
            'status' => JobStatus::Approved,
            'approved_at' => now(),
            'approved_by' => $request->user()?->id,
            'rejected_at' => null,
            'rejected_by' => null,
            'rejection_reason' => null,
            'is_active' => true,
            'published_at' => $job->published_at ?? now(),
        ])->save();

        AuditLog::create([
            'event' => 'admin.job.approved',
            'user_id' => $job->user_id,
            'ip_address' => $request->ip(),
            'context' => ['job_id' => $job->id, 'by_admin' => $request->user()?->id],
        ]);

        return back()->with('success', __('Job approved and published.'));
    }

    public function reject(RejectJobPostingRequest $request, int $id): RedirectResponse
    {
        /** @var JobPosting $job */
        $job = JobPosting::findOrFail($id);

        $job->fill([
            'status' => JobStatus::Rejected,
            'rejection_reason' => $request->validated('rejection_reason'),
            'rejected_at' => now(),
            'rejected_by' => $request->user()?->id,
            'is_active' => false,
        ])->save();

        AuditLog::create([
            'event' => 'admin.job.rejected',
            'user_id' => $job->user_id,
            'ip_address' => $request->ip(),
            'context' => ['job_id' => $job->id, 'by_admin' => $request->user()?->id],
        ]);

        return back()->with('success', __('Job rejected.'));
    }

    public function toggleActive(Request $request, int $id): RedirectResponse
    {
        /** @var JobPosting $job */
        $job = JobPosting::findOrFail($id);

        if ($job->status !== JobStatus::Approved && ! $job->is_active) {
            return back()->with('error', __('Only approved jobs can be published.'));
        }

        $job->is_active = ! $job->is_active;
        if ($job->is_active && $job->published_at === null) {
            $job->published_at = now();
        }
        $job->save();

        return back()->with(
            'success',
            $job->is_active ? __('Job published.') : __('Job unpublished.'),
        );
    }

    public function destroy(Request $request, int $id): RedirectResponse
    {
        /** @var JobPosting $job */
        $job = JobPosting::findOrFail($id);
        $jobId = $job->id;
        $userId = $job->user_id;
        $job->delete();

        AuditLog::create([
            'event' => 'admin.job.deleted',
            'user_id' => $userId,
            'ip_address' => $request->ip(),
            'context' => ['job_id' => $jobId],
        ]);

        return redirect()
            ->route('admin.jobs.index')
            ->with('success', __('Job moved to trash.'));
    }

    /**
     * @return array<int, array{id: int, label: string}>
     */
    private function companyOptions(): array
    {
        return EmployerProfile::query()
            ->with('user')
            ->orderBy('company_name')
            ->get()
            ->map(fn (EmployerProfile $p): array => [
                'id' => $p->id,
                'label' => $p->company_name . ' (' . $p->user->email . ')',
            ])
            ->all();
    }

    /**
     * @return array<string, mixed>
     */
    private function serializeJob(JobPosting $job): array
    {
        return [
            'id' => $job->id,
            'title' => $job->title,
            'slug' => $job->slug,
            'company_name' => $job->employerProfile->company_name,
            'company_id' => $job->employer_profile_id,
            'location' => $job->location,
            'country' => $job->country,
            'remote_type' => $job->remote_type->value,
            'employment_type' => $job->employment_type->value,
            'status' => $job->status->value,
            'status_label' => $job->status->label(),
            'is_active' => $job->is_active,
            'payment_amount' => $job->payment_amount,
            'payment_currency' => $job->payment_currency,
            'payment_status' => $job->payment_status->value,
            'payment_status_label' => $job->payment_status->label(),
            'payment_method' => $job->payment_method,
            'salary_label' => $job->formattedSalary(),
            'expires_at' => $job->expires_at?->toIso8601String(),
            'created_at' => $job->created_at?->toIso8601String(),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function serializeJobDetail(JobPosting $job): array
    {
        return [
            ...$this->serializeJob($job),
            'employer_profile_id' => $job->employer_profile_id,
            'user_id' => $job->user_id,
            'description' => $job->description,
            'requirements' => $job->requirements,
            'benefits' => $job->benefits,
            'salary_min' => $job->salary_min,
            'salary_max' => $job->salary_max,
            'salary_period' => $job->salary_period,
            'payment_reference' => $job->payment_reference,
            'rejection_reason' => $job->rejection_reason,
            'approved_at' => $job->approved_at?->toIso8601String(),
            'rejected_at' => $job->rejected_at?->toIso8601String(),
            'published_at' => $job->published_at?->toIso8601String(),
            'views_count' => $job->views_count,
            'contact_name' => $job->user->name,
            'contact_email' => $job->user->email,
        ];
    }
}
