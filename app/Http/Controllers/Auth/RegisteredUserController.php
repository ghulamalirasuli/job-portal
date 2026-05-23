<?php

declare(strict_types=1);

namespace App\Http\Controllers\Auth;

use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Landing/role-picker for registration. Actual submission goes to
 * RegisteredSeekerController or RegisteredEmployerController.
 */
class RegisteredUserController extends Controller
{
    public function create(Request $request): Response|RedirectResponse
    {
        $role = $request->query('role');
        if (is_string($role)) {
            if ($role === UserRole::JobSeeker->value) {
                return redirect()->route('register.seeker');
            }
            if ($role === UserRole::Employer->value) {
                return redirect()->route('register.employer');
            }
        }

        return Inertia::render('Auth/RegisterChoose');
    }
}
