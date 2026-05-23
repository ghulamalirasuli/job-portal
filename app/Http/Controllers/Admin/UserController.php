<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpKernel\Exception\HttpException;

class UserController extends Controller
{
    public function index(Request $request): Response
    {
        $validated = $request->validate([
            'q' => ['nullable', 'string', 'max:120'],
            'role' => ['nullable', 'string', 'in:' . implode(',', UserRole::values())],
            'status' => ['nullable', 'string', 'in:active,inactive,unverified'],
            'page' => ['nullable', 'integer', 'min:1'],
        ]);

        $query = User::query();

        if (! empty($validated['q'])) {
            $term = '%' . $validated['q'] . '%';
            $query->where(function ($q) use ($term): void {
                $q->where('name', 'like', $term)
                    ->orWhere('email', 'like', $term);
            });
        }

        if (! empty($validated['role'])) {
            $query->where('role', $validated['role']);
        }

        if (! empty($validated['status'])) {
            match ($validated['status']) {
                'active' => $query->where('is_active', true),
                'inactive' => $query->where('is_active', false),
                'unverified' => $query->whereNull('email_verified_at'),
                default => null,
            };
        }

        $users = $query
            ->latest('created_at')
            ->paginate(15)
            ->withQueryString()
            ->through(fn (User $u): array => [
                'id' => $u->id,
                'name' => $u->name,
                'email' => $u->email,
                'role' => $u->role->value,
                'is_active' => $u->is_active,
                'email_verified' => $u->email_verified_at !== null,
                'avatar_url' => $u->avatarUrl(),
                'created_at' => $u->created_at?->toIso8601String(),
                'last_login_at' => $u->last_login_at?->toIso8601String(),
            ]);

        return Inertia::render('Admin/Users/Index', [
            'users' => $users,
            'filters' => [
                'q' => $validated['q'] ?? '',
                'role' => $validated['role'] ?? '',
                'status' => $validated['status'] ?? '',
            ],
            'roles' => UserRole::values(),
        ]);
    }

    public function show(int $id): Response
    {
        /** @var User $user */
        $user = User::with(['seekerProfile', 'employerProfile'])->findOrFail($id);

        $auditLogs = AuditLog::query()
            ->where('user_id', $user->id)
            ->latest('created_at')
            ->limit(20)
            ->get(['id', 'event', 'ip_address', 'created_at'])
            ->map(fn (AuditLog $a): array => [
                'id' => $a->id,
                'event' => $a->event,
                'ip_address' => $a->ip_address,
                'created_at' => $a->created_at->toIso8601String(),
            ])
            ->all();

        return Inertia::render('Admin/Users/Show', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role->value,
                'is_active' => $user->is_active,
                'locale' => $user->locale,
                'avatar_url' => $user->avatarUrl(),
                'email_verified' => $user->email_verified_at !== null,
                'created_at' => $user->created_at?->toIso8601String(),
                'last_login_at' => $user->last_login_at?->toIso8601String(),
                'last_login_ip' => $user->last_login_ip,
                'seeker_profile' => $user->seekerProfile ? [
                    'headline' => $user->seekerProfile->headline,
                    'location' => $user->seekerProfile->location,
                    'country' => $user->seekerProfile->country,
                    'visibility' => $user->seekerProfile->visibility,
                ] : null,
                'employer_profile' => $user->employerProfile ? [
                    'company_name' => $user->employerProfile->company_name,
                    'company_size' => $user->employerProfile->company_size,
                    'industry' => $user->employerProfile->industry,
                    'country' => $user->employerProfile->country,
                    'website' => $user->employerProfile->website,
                    'verified_at' => $user->employerProfile->verified_at?->toIso8601String(),
                ] : null,
            ],
            'auditLogs' => $auditLogs,
        ]);
    }

    public function toggleActive(Request $request, int $id): RedirectResponse
    {
        /** @var User $user */
        $user = User::findOrFail($id);

        if ($user->id === $request->user()?->id) {
            throw new HttpException(422, 'You cannot deactivate your own account.');
        }

        $user->is_active = ! $user->is_active;
        $user->save();

        AuditLog::create([
            'event' => $user->is_active ? 'admin.user.activated' : 'admin.user.deactivated',
            'user_id' => $user->id,
            'ip_address' => $request->ip(),
            'context' => ['by_admin' => $request->user()?->id],
        ]);

        return back()->with(
            'success',
            $user->is_active
                ? __('User activated.')
                : __('User deactivated.'),
        );
    }

    public function destroy(Request $request, int $id): RedirectResponse
    {
        /** @var User $user */
        $user = User::findOrFail($id);

        if ($user->id === $request->user()?->id) {
            throw new HttpException(422, 'You cannot delete your own account.');
        }

        $user->delete();

        AuditLog::create([
            'event' => 'admin.user.soft_deleted',
            'user_id' => $user->id,
            'ip_address' => $request->ip(),
            'context' => ['by_admin' => $request->user()?->id],
        ]);

        return redirect()
            ->route('admin.users.index')
            ->with('success', __('User moved to trash.'));
    }
}
