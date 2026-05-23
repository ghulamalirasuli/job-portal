<?php

declare(strict_types=1);

namespace App\Http\Controllers\Seeker;

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
        $profile = $user->seekerProfile;

        return Inertia::render('Seeker/Dashboard', [
            'profile' => $profile === null ? null : [
                'headline' => $profile->headline,
                'summary' => $profile->summary,
                'visibility' => $profile->visibility,
                'is_complete' => $profile->headline !== null && $profile->summary !== null,
            ],
        ]);
    }
}
