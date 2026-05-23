<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use App\Models\SiteSetting;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Middleware;
use Tighten\Ziggy\Ziggy;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        /** @var User|null $user */
        $user = $request->user();

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $user === null ? null : [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role->value,
                    'locale' => $user->locale,
                    'is_active' => $user->is_active,
                    'avatar_url' => $user->avatarUrl(),
                    'email_verified_at' => $user->email_verified_at?->toIso8601String(),
                ],
            ],
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
                'info' => fn () => $request->session()->get('info'),
            ],
            'locale' => fn () => app()->getLocale(),
            'availableLocales' => config('app.available_locales', ['en']),
            'siteSettings' => function (): array {
                $settings = SiteSetting::current();

                return [
                    'service_name' => $settings->service_name,
                    'logo_url' => $settings->logoUrl(),
                    'contact_email' => $settings->contact_email,
                    'whatsapp' => $settings->whatsapp,
                    'phone' => $settings->phone,
                    'address' => $settings->address,
                    'about_us' => $settings->about_us,
                ];
            },
            'ziggy' => fn (): array => [
                ...(new Ziggy())->toArray(),
                'location' => $request->url(),
            ],
        ];
    }
}
