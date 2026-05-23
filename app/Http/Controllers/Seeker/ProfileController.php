<?php

declare(strict_types=1);

namespace App\Http\Controllers\Seeker;

use App\Http\Controllers\Controller;
use App\Http\Requests\Profile\UpdateSeekerProfileRequest;
use App\Models\SeekerProfile;
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
        $profile = $user->seekerProfile ?? new SeekerProfile(['visibility' => 'private']);

        return Inertia::render('Seeker/Profile', [
            'profile' => [
                'headline' => $profile->headline,
                'location' => $profile->location,
                'country' => $profile->country,
                'phone' => $profile->phone,
                'summary' => $profile->summary,
                'visibility' => $profile->visibility,
                'avatar_url' => $user->avatarUrl(),
            ],
        ]);
    }

    public function update(UpdateSeekerProfileRequest $request): RedirectResponse
    {
        /** @var User $user */
        $user = $request->user();
        $validated = $request->validated();

        $profile = $user->seekerProfile ?? new SeekerProfile(['user_id' => $user->id]);
        $profile->fill([
            'headline' => $validated['headline'] ?? null,
            'location' => $validated['location'] ?? null,
            'country' => isset($validated['country']) ? mb_strtoupper((string) $validated['country']) : null,
            'phone' => $validated['phone'] ?? null,
            'summary' => $validated['summary'] ?? null,
            'visibility' => $validated['visibility'],
        ]);
        $profile->user_id = $user->id;
        $profile->save();

        if ($request->hasFile('avatar')) {
            if ($user->avatar_path !== null) {
                Storage::disk('public')->delete($user->avatar_path);
            }
            $path = $request->file('avatar')->store('avatars', 'public');
            $user->forceFill(['avatar_path' => $path])->saveQuietly();
        }

        return back()->with('success', __('profile.saved'));
    }
}
