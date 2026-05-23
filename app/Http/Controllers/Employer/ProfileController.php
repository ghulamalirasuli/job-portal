<?php

declare(strict_types=1);

namespace App\Http\Controllers\Employer;

use App\Http\Controllers\Controller;
use App\Http\Requests\Profile\UpdateEmployerProfileRequest;
use App\Models\EmployerProfile;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    public function edit(Request $request): Response
    {
        /** @var User $user */
        $user = $request->user();
        $profile = $user->employerProfile ?? new EmployerProfile(['company_name' => $user->name]);

        return Inertia::render('Employer/Profile', [
            'profile' => [
                'company_name' => $profile->company_name,
                'company_size' => $profile->company_size,
                'industry' => $profile->industry,
                'website' => $profile->website,
                'vat_number' => $profile->vat_number,
                'country' => $profile->country,
                'description' => $profile->description,
                'logo_url' => $profile->logoUrl(),
                'is_verified' => $profile->isVerified(),
            ],
        ]);
    }

    public function update(UpdateEmployerProfileRequest $request): RedirectResponse
    {
        /** @var User $user */
        $user = $request->user();
        $validated = $request->validated();

        $profile = $user->employerProfile ?? new EmployerProfile(['user_id' => $user->id]);
        $profile->fill([
            'company_name' => $validated['company_name'],
            'company_size' => $validated['company_size'] ?? null,
            'industry' => $validated['industry'] ?? null,
            'website' => $validated['website'] ?? null,
            'vat_number' => $validated['vat_number'] ?? null,
            'country' => isset($validated['country']) ? mb_strtoupper((string) $validated['country']) : null,
            'description' => $validated['description'] ?? null,
        ]);
        $profile->user_id = $user->id;

        if ($request->hasFile('logo')) {
            if ($profile->logo_path !== null) {
                Storage::disk('public')->delete($profile->logo_path);
            }
            $profile->logo_path = $request->file('logo')->store('logos', 'public');
        }

        $profile->save();

        return back()->with('success', __('profile.saved'));
    }
}
