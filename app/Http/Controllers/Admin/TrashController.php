<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class TrashController extends Controller
{
    public function index(): Response
    {
        $users = User::onlyTrashed()
            ->latest('deleted_at')
            ->paginate(20)
            ->through(fn (User $u): array => [
                'id' => $u->id,
                'name' => $u->name,
                'email' => $u->email,
                'role' => $u->role->value,
                'deleted_at' => $u->deleted_at?->toIso8601String(),
            ]);

        return Inertia::render('Admin/Trash', [
            'users' => $users,
        ]);
    }

    public function restore(Request $request, int $id): RedirectResponse
    {
        /** @var User|null $user */
        $user = User::onlyTrashed()->find($id);

        if ($user === null) {
            return back()->with('error', __('User not found in trash.'));
        }

        $user->restore();
        $user->is_active = true;
        $user->save();

        AuditLog::create([
            'event' => 'admin.user.restored',
            'user_id' => $user->id,
            'ip_address' => $request->ip(),
            'context' => ['by_admin' => $request->user()?->id],
        ]);

        return back()->with('success', __('User restored.'));
    }

    public function forceDelete(Request $request, int $id): RedirectResponse
    {
        /** @var User|null $user */
        $user = User::onlyTrashed()->find($id);

        if ($user === null) {
            return back()->with('error', __('User not found in trash.'));
        }

        DB::transaction(function () use ($user, $request): void {
            if ($user->avatar_path !== null) {
                Storage::disk('public')->delete($user->avatar_path);
            }

            $user->seekerProfile()->delete();
            $user->employerProfile()->delete();
            $user->syncRoles([]);

            $userId = $user->id;
            $user->forceDelete();

            AuditLog::create([
                'event' => 'admin.user.force_deleted',
                'user_id' => $userId,
                'ip_address' => $request->ip(),
                'context' => ['by_admin' => $request->user()?->id],
            ]);
        });

        return back()->with('success', __('User permanently deleted.'));
    }
}
