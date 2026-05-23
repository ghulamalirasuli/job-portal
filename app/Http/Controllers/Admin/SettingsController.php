<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateSettingsRequest;
use App\Models\SiteSetting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class SettingsController extends Controller
{
    public function edit(): Response
    {
        $settings = SiteSetting::current();

        return Inertia::render('Admin/Settings', [
            'settings' => [
                'service_name' => $settings->service_name,
                'contact_email' => $settings->contact_email,
                'whatsapp' => $settings->whatsapp,
                'phone' => $settings->phone,
                'address' => $settings->address,
                'about_us' => $settings->about_us,
                'logo_url' => $settings->logoUrl(),
            ],
        ]);
    }

    public function update(UpdateSettingsRequest $request): RedirectResponse
    {
        $settings = SiteSetting::current();
        $validated = $request->validated();

        $settings->fill([
            'service_name' => $validated['service_name'],
            'contact_email' => $validated['contact_email'] ?? null,
            'whatsapp' => $validated['whatsapp'] ?? null,
            'phone' => $validated['phone'] ?? null,
            'address' => $validated['address'] ?? null,
            'about_us' => $validated['about_us'] ?? null,
        ]);

        if ($request->boolean('remove_logo') && $settings->logo_path !== null) {
            Storage::disk('public')->delete($settings->logo_path);
            $settings->logo_path = null;
        }

        if ($request->hasFile('logo')) {
            if ($settings->logo_path !== null) {
                Storage::disk('public')->delete($settings->logo_path);
            }
            $settings->logo_path = $request->file('logo')->store('branding', 'public');
        }

        $settings->save();

        return back()->with('success', __('Settings saved.'));
    }
}
