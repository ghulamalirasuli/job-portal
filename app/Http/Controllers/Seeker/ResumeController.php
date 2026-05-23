<?php

declare(strict_types=1);

namespace App\Http\Controllers\Seeker;

use App\Http\Controllers\Controller;
use App\Http\Requests\Seeker\UpdateResumeRequest;
use App\Models\AuditLog;
use App\Models\SeekerProfile;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class ResumeController extends Controller
{
    public function edit(): Response
    {
        /** @var \App\Models\User $user */
        $user = auth()->user();
        $profile = $user->seekerProfile ?? new SeekerProfile(['user_id' => $user->id]);
        $resume = $profile->resumeData();

        return Inertia::render('Seeker/Resume/Builder', [
            'profile' => [
                'name' => $user->name,
                'email' => $user->email,
                'headline' => $profile->headline,
                'location' => $profile->location,
                'country' => $profile->country,
                'phone' => $profile->phone,
                'avatar_url' => $user->avatarUrl(),
            ],
            'resume' => $resume,
            'completeness' => $profile->resumeCompleteness(),
        ]);
    }

    public function update(UpdateResumeRequest $request): RedirectResponse
    {
        /** @var \App\Models\User $user */
        $user = auth()->user();
        $data = $request->validated();

        $profile = $user->seekerProfile ?? new SeekerProfile(['user_id' => $user->id, 'visibility' => 'private']);
        $profile->user_id = $user->id;
        $profile->resume_data = [
            'summary' => $data['summary'] ?? '',
            'experiences' => array_values($data['experiences'] ?? []),
            'education' => array_values($data['education'] ?? []),
            'skills' => array_values(array_filter($data['skills'] ?? [])),
            'languages' => array_values($data['languages'] ?? []),
        ];
        $profile->save();

        AuditLog::create([
            'event' => 'seeker.resume.updated',
            'user_id' => $user->id,
            'ip_address' => $request->ip(),
        ]);

        return back()->with('success', __('Resume saved.'));
    }
}
