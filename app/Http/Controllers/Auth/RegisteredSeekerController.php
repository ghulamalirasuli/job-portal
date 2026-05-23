<?php

declare(strict_types=1);

namespace App\Http\Controllers\Auth;

use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\RegisterSeekerRequest;
use App\Models\AuditLog;
use App\Models\SeekerProfile;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredSeekerController extends Controller
{
    public function create(): Response
    {
        return Inertia::render('Auth/RegisterSeeker');
    }

    public function store(RegisterSeekerRequest $request): RedirectResponse
    {
        $data = $request->validated();

        $user = DB::transaction(function () use ($data, $request): User {
            $user = User::create([
                'name' => $data['name'],
                'email' => mb_strtolower($data['email']),
                'password' => Hash::make($data['password']),
                'role' => UserRole::JobSeeker,
                'locale' => $data['locale'] ?? app()->getLocale(),
            ]);

            $user->syncRoles([UserRole::JobSeeker->value]);

            SeekerProfile::create([
                'user_id' => $user->id,
                'visibility' => 'private',
            ]);

            AuditLog::create([
                'event' => 'auth.register.seeker',
                'user_id' => $user->id,
                'ip_address' => $request->ip(),
                'context' => ['locale' => $user->locale],
            ]);

            return $user;
        });

        event(new Registered($user));
        Auth::login($user);

        return redirect()->route('seeker.dashboard');
    }
}
