<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreEmployeeRequest;
use App\Http\Requests\Admin\UpdateEmployeeRequest;
use App\Models\AuditLog;
use App\Models\SeekerProfile;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class EmployeeController extends Controller
{
    public function index(Request $request): Response
    {
        $validated = $request->validate([
            'q' => ['nullable', 'string', 'max:120'],
            'status' => ['nullable', 'string', 'in:active,inactive,public,private'],
            'page' => ['nullable', 'integer', 'min:1'],
        ]);

        $query = SeekerProfile::query()->with(['user']);

        if (! empty($validated['q'])) {
            $term = '%' . $validated['q'] . '%';
            $query->where(function ($q) use ($term): void {
                $q->where('headline', 'like', $term)
                    ->orWhere('location', 'like', $term)
                    ->orWhereHas('user', fn ($u) => $u->where('name', 'like', $term)->orWhere('email', 'like', $term));
            });
        }

        if (! empty($validated['status'])) {
            match ($validated['status']) {
                'active' => $query->whereHas('user', fn ($u) => $u->where('is_active', true)),
                'inactive' => $query->whereHas('user', fn ($u) => $u->where('is_active', false)),
                'public' => $query->where('visibility', 'public'),
                'private' => $query->where('visibility', 'private'),
                default => null,
            };
        }

        $employees = $query
            ->latest('created_at')
            ->paginate(15)
            ->withQueryString()
            ->through(fn (SeekerProfile $p): array => $this->serializeEmployee($p));

        return Inertia::render('Admin/Employees/Index', [
            'employees' => $employees,
            'filters' => [
                'q' => $validated['q'] ?? '',
                'status' => $validated['status'] ?? '',
            ],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Employees/Form', [
            'employee' => null,
        ]);
    }

    public function store(StoreEmployeeRequest $request): RedirectResponse
    {
        $data = $request->validated();

        $user = DB::transaction(function () use ($data, $request): User {
            $user = User::create([
                'name' => $data['name'],
                'email' => mb_strtolower($data['email']),
                'password' => Hash::make($data['password']),
                'role' => UserRole::JobSeeker,
                'locale' => $data['locale'] ?? 'en',
                'is_active' => $data['is_active'] ?? true,
            ]);
            $user->syncRoles([UserRole::JobSeeker->value]);

            SeekerProfile::create([
                'user_id' => $user->id,
                'headline' => $data['headline'] ?? null,
                'location' => $data['location'] ?? null,
                'country' => isset($data['country']) ? mb_strtoupper($data['country']) : null,
                'phone' => $data['phone'] ?? null,
                'summary' => $data['summary'] ?? null,
                'visibility' => $data['visibility'],
            ]);

            AuditLog::create([
                'event' => 'admin.employee.created',
                'user_id' => $user->id,
                'ip_address' => $request->ip(),
            ]);

            return $user;
        });

        return redirect()
            ->route('admin.employees.edit', $user->id)
            ->with('success', __('Employee created.'));
    }

    public function edit(int $id): Response
    {
        /** @var User $user */
        $user = User::with('seekerProfile')->where('role', UserRole::JobSeeker)->findOrFail($id);
        $profile = $user->seekerProfile;

        return Inertia::render('Admin/Employees/Form', [
            'employee' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'locale' => $user->locale,
                'is_active' => $user->is_active,
                'headline' => $profile?->headline,
                'location' => $profile?->location,
                'country' => $profile?->country,
                'phone' => $profile?->phone,
                'summary' => $profile?->summary,
                'visibility' => $profile?->visibility ?? 'private',
                'avatar_url' => $user->avatarUrl(),
            ],
        ]);
    }

    public function update(UpdateEmployeeRequest $request, int $id): RedirectResponse
    {
        /** @var User $user */
        $user = User::with('seekerProfile')->where('role', UserRole::JobSeeker)->findOrFail($id);
        $data = $request->validated();

        $user->fill([
            'name' => $data['name'],
            'email' => mb_strtolower($data['email']),
            'locale' => $data['locale'] ?? $user->locale,
            'is_active' => $data['is_active'] ?? $user->is_active,
        ])->save();

        $profile = $user->seekerProfile ?? new SeekerProfile(['user_id' => $user->id]);
        $profile->fill([
            'headline' => $data['headline'] ?? null,
            'location' => $data['location'] ?? null,
            'country' => isset($data['country']) ? mb_strtoupper($data['country']) : null,
            'phone' => $data['phone'] ?? null,
            'summary' => $data['summary'] ?? null,
            'visibility' => $data['visibility'],
        ]);
        $profile->user_id = $user->id;
        $profile->save();

        if ($request->hasFile('avatar')) {
            if ($user->avatar_path !== null) {
                Storage::disk('public')->delete($user->avatar_path);
            }
            $user->forceFill([
                'avatar_path' => $request->file('avatar')->store('avatars', 'public'),
            ])->saveQuietly();
        }

        AuditLog::create([
            'event' => 'admin.employee.updated',
            'user_id' => $user->id,
            'ip_address' => $request->ip(),
        ]);

        return back()->with('success', __('Employee updated.'));
    }

    public function toggleActive(Request $request, int $id): RedirectResponse
    {
        /** @var User $user */
        $user = User::where('role', UserRole::JobSeeker)->findOrFail($id);
        $user->is_active = ! $user->is_active;
        $user->save();

        return back()->with(
            'success',
            $user->is_active ? __('Employee activated.') : __('Employee deactivated.'),
        );
    }

    public function destroy(Request $request, int $id): RedirectResponse
    {
        /** @var User $user */
        $user = User::where('role', UserRole::JobSeeker)->findOrFail($id);
        $user->delete();

        AuditLog::create([
            'event' => 'admin.employee.soft_deleted',
            'user_id' => $user->id,
            'ip_address' => $request->ip(),
        ]);

        return redirect()
            ->route('admin.employees.index')
            ->with('success', __('Employee moved to trash.'));
    }

    /**
     * @return array<string, mixed>
     */
    private function serializeEmployee(SeekerProfile $profile): array
    {
        $user = $profile->user;

        return [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'headline' => $profile->headline,
            'location' => $profile->location,
            'country' => $profile->country,
            'visibility' => $profile->visibility,
            'is_active' => $user->is_active,
            'avatar_url' => $user->avatarUrl(),
            'created_at' => $profile->created_at?->toIso8601String(),
        ];
    }
}
