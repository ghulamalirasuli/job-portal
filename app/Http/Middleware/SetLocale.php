<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use App\Models\User;
use Closure;
use Illuminate\Http\Request;

class SetLocale
{
    /**
     * Resolve the request locale in this order:
     *   1. Authenticated user's stored locale
     *   2. `locale` cookie
     *   3. Accept-Language header
     *   4. App fallback locale
     *
     * @param  Closure(Request): mixed  $next
     */
    public function handle(Request $request, Closure $next): mixed
    {
        /** @var User|null $user */
        $user = $request->user();
        $available = config('app.available_locales', ['en']);
        $fallback = config('app.fallback_locale', 'en');

        $candidate = $user?->locale
            ?? $request->cookie('locale')
            ?? $request->getPreferredLanguage($available)
            ?? $fallback;

        if (! in_array($candidate, $available, true)) {
            $candidate = $fallback;
        }

        app()->setLocale($candidate);

        return $next($request);
    }
}
