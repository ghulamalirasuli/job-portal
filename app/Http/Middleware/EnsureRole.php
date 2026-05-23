<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use App\Enums\UserRole;
use App\Models\User;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Symfony\Component\HttpKernel\Exception\HttpException;

class EnsureRole
{
    /**
     * Ensure the authenticated user has one of the given roles.
     *
     * @param  Closure(Request): mixed  $next
     */
    public function handle(Request $request, Closure $next, string ...$roles): mixed
    {
        /** @var User|null $user */
        $user = $request->user();

        if ($user === null) {
            abort(Response::HTTP_UNAUTHORIZED);
        }

        $allowed = array_map(static fn (string $value): UserRole => UserRole::from($value), $roles);

        if (! in_array($user->role, $allowed, true)) {
            throw new HttpException(Response::HTTP_FORBIDDEN, 'You do not have access to this area.');
        }

        return $next($request);
    }
}
