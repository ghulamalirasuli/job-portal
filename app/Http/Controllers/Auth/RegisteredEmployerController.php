<?php

declare(strict_types=1);

namespace App\Http\Controllers\Auth;

use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\RegisterEmployerRequest;
use App\Models\AuditLog;
use App\Models\EmployerProfile;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredEmployerController extends Controller
{
    public function create(): Response
    {
        return Inertia::render('Auth/RegisterEmployer');
    }

    public function store(RegisterEmployerRequest $request): RedirectResponse
    {
        $data = $request->validated();

        $user = DB::transaction(function () use ($data, $request): User {
            $user = User::create([
                'name' => $data['name'],
                'email' => mb_strtolower($data['email']),
                'password' => Hash::make($data['password']),
                'role' => UserRole::Employer,
                'locale' => $data['locale'] ?? app()->getLocale(),
            ]);

            $user->syncRoles([UserRole::Employer->value]);

            EmployerProfile::create([
                'user_id' => $user->id,
                'company_name' => $data['company_name'],
                'country' => mb_strtoupper($data['country']),
            ]);

            AuditLog::create([
                'event' => 'auth.register.employer',
                'user_id' => $user->id,
                'ip_address' => $request->ip(),
                'context' => [
                    'locale' => $user->locale,
                    'country' => mb_strtoupper($data['country']),
                ],
            ]);

            return $user;
        });

        event(new Registered($user));
        Auth::login($user);

        return redirect()->route('employer.dashboard');
    }
}
