<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Enums\JobStatus;
use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Models\ContactMessage;
use App\Models\JobPosting;
use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(): Response
    {
        $totals = [
            'users' => User::count(),
            'seekers' => User::where('role', UserRole::JobSeeker->value)->count(),
            'employers' => User::where('role', UserRole::Employer->value)->count(),
            'admins' => User::where('role', UserRole::Admin->value)->count(),
            'active' => User::where('is_active', true)->count(),
            'inactive' => User::where('is_active', false)->count(),
            'in_trash' => User::onlyTrashed()->count(),
            'new_this_week' => User::where('created_at', '>=', now()->subDays(7))->count(),
            'jobs_active' => JobPosting::query()->where('status', JobStatus::Approved)->where('is_active', true)->count(),
            'jobs_pending' => JobPosting::query()->where('status', JobStatus::PendingApproval)->count(),
            'contact_new' => ContactMessage::query()->where('status', ContactMessage::STATUS_NEW)->count(),
        ];

        $recentSignups = User::query()
            ->latest('created_at')
            ->limit(10)
            ->get(['id', 'name', 'email', 'role', 'is_active', 'created_at'])
            ->map(function (User $u): array {
                return [
                    'id' => $u->id,
                    'name' => $u->name,
                    'email' => $u->email,
                    'role' => $u->role->value,
                    'is_active' => $u->is_active,
                    'avatar_url' => $u->avatarUrl(),
                    'created_at' => $u->created_at?->toIso8601String(),
                ];
            })
            ->all();

        return Inertia::render('Admin/Dashboard', [
            'totals' => $totals,
            'recentSignups' => $recentSignups,
        ]);
    }
}
