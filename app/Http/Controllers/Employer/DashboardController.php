<?php

declare(strict_types=1);

namespace App\Http\Controllers\Employer;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(Request $request): Response
    {
        /** @var User $user */
        $user = $request->user();
        $profile = $user->employerProfile;

        return Inertia::render('Employer/Dashboard', [
            'profile' => $profile === null ? null : [
                'company_name' => $profile->company_name,
                'is_verified' => $profile->isVerified(),
                'logo_url' => $profile->logoUrl(),
            ],
        ]);
    }
}
