<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreCompanyRequest;
use App\Http\Requests\Admin\UpdateCompanyRequest;
use App\Models\AuditLog;
use App\Models\EmployerProfile;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpKernel\Exception\HttpException;

class CompanyController extends Controller
{
    public function index(Request $request): Response
    {
        $validated = $request->validate([
            'q' => ['nullable', 'string', 'max:120'],
            'status' => ['nullable', 'string', 'in:active,inactive,verified,unverified'],
            'page' => ['nullable', 'integer', 'min:1'],
        ]);

        $query = EmployerProfile::query()->with(['user']);

        if (! empty($validated['q'])) {
            $term = '%' . $validated['q'] . '%';
            $query->where(function ($q) use ($term): void {
                $q->where('company_name', 'like', $term)
                    ->orWhere('industry', 'like', $term)
                    ->orWhereHas('user', fn ($u) => $u->where('name', 'like', $term)->orWhere('email', 'like', $term));
            });
        }

        if (! empty($validated['status'])) {
            match ($validated['status']) {
                'active' => $query->whereHas('user', fn ($u) => $u->where('is_active', true)),
                'inactive' => $query->whereHas('user', fn ($u) => $u->where('is_active', false)),
                'verified' => $query->whereNotNull('verified_at'),
                'unverified' => $query->whereNull('verified_at'),
                default => null,
            };
        }

        $companies = $query
            ->latest('created_at')
            ->paginate(15)
            ->withQueryString()
            ->through(fn (EmployerProfile $p): array => $this->serializeCompany($p));

        return Inertia::render('Admin/Companies/Index', [
            'companies' => $companies,
            'filters' => [
                'q' => $validated['q'] ?? '',
                'status' => $validated['status'] ?? '',
            ],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Companies/Form', [
            'company' => null,
        ]);
    }

    public function store(StoreCompanyRequest $request): RedirectResponse
    {
        $data = $request->validated();

        $user = DB::transaction(function () use ($data, $request): User {
            $user = User::create([
                'name' => $data['name'],
                'email' => mb_strtolower($data['email']),
                'password' => Hash::make($data['password']),
                'role' => UserRole::Employer,
                'locale' => $data['locale'] ?? 'en',
                'is_active' => $data['is_active'] ?? true,
            ]);
            $user->syncRoles([UserRole::Employer->value]);

            EmployerProfile::create([
                'user_id' => $user->id,
                'company_name' => $data['company_name'],
                'company_size' => $data['company_size'] ?? null,
                'industry' => $data['industry'] ?? null,
                'website' => $data['website'] ?? null,
                'vat_number' => $data['vat_number'] ?? null,
                'country' => isset($data['country']) ? mb_strtoupper($data['country']) : null,
                'description' => $data['description'] ?? null,
                'verified_at' => ($data['is_verified'] ?? false) ? now() : null,
            ]);

            AuditLog::create([
                'event' => 'admin.company.created',
                'user_id' => $user->id,
                'ip_address' => $request->ip(),
            ]);

            return $user;
        });

        return redirect()
            ->route('admin.companies.edit', $user->id)
            ->with('success', __('Company created.'));
    }

    public function edit(int $id): Response
    {
        /** @var User $user */
        $user = User::with('employerProfile')->where('role', UserRole::Employer)->findOrFail($id);
        $profile = $user->employerProfile;

        return Inertia::render('Admin/Companies/Form', [
            'company' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'locale' => $user->locale,
                'is_active' => $user->is_active,
                'is_verified' => $profile?->verified_at !== null,
                'company_name' => $profile?->company_name,
                'company_size' => $profile?->company_size,
                'industry' => $profile?->industry,
                'website' => $profile?->website,
                'vat_number' => $profile?->vat_number,
                'country' => $profile?->country,
                'description' => $profile?->description,
                'logo_url' => $profile?->logoUrl(),
                'jobs_count' => $profile?->jobPostings()->count() ?? 0,
            ],
        ]);
    }

    public function update(UpdateCompanyRequest $request, int $id): RedirectResponse
    {
        /** @var User $user */
        $user = User::with('employerProfile')->where('role', UserRole::Employer)->findOrFail($id);
        $data = $request->validated();

        $user->fill([
            'name' => $data['name'],
            'email' => mb_strtolower($data['email']),
            'locale' => $data['locale'] ?? $user->locale,
            'is_active' => $data['is_active'] ?? $user->is_active,
        ])->save();

        $profile = $user->employerProfile ?? new EmployerProfile(['user_id' => $user->id]);
        $profile->fill([
            'company_name' => $data['company_name'],
            'company_size' => $data['company_size'] ?? null,
            'industry' => $data['industry'] ?? null,
            'website' => $data['website'] ?? null,
            'vat_number' => $data['vat_number'] ?? null,
            'country' => isset($data['country']) ? mb_strtoupper($data['country']) : null,
            'description' => $data['description'] ?? null,
            'verified_at' => ($data['is_verified'] ?? false) ? ($profile->verified_at ?? now()) : null,
        ]);
        $profile->user_id = $user->id;
        $profile->save();

        if ($request->hasFile('logo')) {
            if ($profile->logo_path !== null) {
                Storage::disk('public')->delete($profile->logo_path);
            }
            $profile->logo_path = $request->file('logo')->store('logos', 'public');
            $profile->save();
        }

        AuditLog::create([
            'event' => 'admin.company.updated',
            'user_id' => $user->id,
            'ip_address' => $request->ip(),
        ]);

        return back()->with('success', __('Company updated.'));
    }

    public function toggleActive(Request $request, int $id): RedirectResponse
    {
        /** @var User $user */
        $user = User::where('role', UserRole::Employer)->findOrFail($id);
        $user->is_active = ! $user->is_active;
        $user->save();

        return back()->with(
            'success',
            $user->is_active ? __('Company activated.') : __('Company deactivated.'),
        );
    }

    public function toggleVerified(Request $request, int $id): RedirectResponse
    {
        /** @var User $user */
        $user = User::with('employerProfile')->where('role', UserRole::Employer)->findOrFail($id);
        $profile = $user->employerProfile;

        if ($profile === null) {
            throw new HttpException(422, 'Company profile not found.');
        }

        $profile->verified_at = $profile->verified_at === null ? now() : null;
        $profile->save();

        return back()->with(
            'success',
            $profile->verified_at ? __('Company verified.') : __('Company verification removed.'),
        );
    }

    public function destroy(Request $request, int $id): RedirectResponse
    {
        /** @var User $user */
        $user = User::where('role', UserRole::Employer)->findOrFail($id);
        $user->delete();

        AuditLog::create([
            'event' => 'admin.company.soft_deleted',
            'user_id' => $user->id,
            'ip_address' => $request->ip(),
        ]);

        return redirect()
            ->route('admin.companies.index')
            ->with('success', __('Company moved to trash.'));
    }

    /**
     * @return array<string, mixed>
     */
    private function serializeCompany(EmployerProfile $profile): array
    {
        $user = $profile->user;

        return [
            'id' => $user->id,
            'company_name' => $profile->company_name,
            'industry' => $profile->industry,
            'country' => $profile->country,
            'logo_url' => $profile->logoUrl(),
            'is_verified' => $profile->verified_at !== null,
            'is_active' => $user->is_active,
            'contact_name' => $user->name,
            'contact_email' => $user->email,
            'jobs_count' => $profile->jobPostings()->count(),
            'created_at' => $profile->created_at?->toIso8601String(),
        ];
    }
}
