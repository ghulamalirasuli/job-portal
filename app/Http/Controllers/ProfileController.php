<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Actions\DeleteAccountAction;
use App\Http\Requests\ProfileUpdateRequest;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    public function edit(Request $request): Response
    {
        /** @var User $user */
        $user = $request->user();

        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $user->email_verified_at === null,
            'status' => session('status'),
        ]);
    }

    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        /** @var User $user */
        $user = $request->user();
        $user->fill($request->validated());

        if ($user->isDirty('email')) {
            $user->email_verified_at = null;
        }

        $user->save();

        return back()->with('success', __('profile.saved'));
    }

    public function destroy(Request $request, DeleteAccountAction $action): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
            'confirmation' => ['required', 'in:DELETE'],
        ]);

        /** @var User $user */
        $user = $request->user();
        $ip = $request->ip();

        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        $action->execute($user, $ip);

        return redirect('/')->with('success', __('Your account has been deleted.'));
    }
}
