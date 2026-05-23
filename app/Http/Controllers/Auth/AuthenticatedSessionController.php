<?php

declare(strict_types=1);

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Models\AuditLog;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    public function create(): Response
    {
        return Inertia::render('Auth/Login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
        ]);
    }

    public function store(LoginRequest $request): RedirectResponse
    {
        $request->authenticate();

        /** @var User $user */
        $user = $request->user();

        if (! $user->is_active) {
            Auth::guard('web')->logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();

            AuditLog::create([
                'event' => 'auth.login.blocked_inactive',
                'user_id' => $user->id,
                'ip_address' => $request->ip(),
            ]);

            throw ValidationException::withMessages([
                'email' => __('Your account is deactivated. Please contact support.'),
            ]);
        }

        $request->session()->regenerate();

        $user->forceFill([
            'last_login_at' => now(),
            'last_login_ip' => $request->ip(),
        ])->saveQuietly();

        AuditLog::create([
            'event' => 'auth.login',
            'user_id' => $user->id,
            'ip_address' => $request->ip(),
        ]);

        return redirect()->intended(route($user->role->dashboardRoute(), absolute: false));
    }

    public function destroy(Request $request): RedirectResponse
    {
        $userId = $request->user()?->id;

        Auth::guard('web')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        if ($userId !== null) {
            AuditLog::create([
                'event' => 'auth.logout',
                'user_id' => $userId,
                'ip_address' => $request->ip(),
            ]);
        }

        return redirect('/');
    }
}
