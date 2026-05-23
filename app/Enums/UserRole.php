<?php

declare(strict_types=1);

namespace App\Enums;

enum UserRole: string
{
    case JobSeeker = 'job_seeker';
    case Employer = 'employer';
    case Admin = 'admin';

    /**
     * Friendly label for UI.
     */
    public function label(): string
    {
        return match ($this) {
            self::JobSeeker => 'Job seeker',
            self::Employer => 'Employer',
            self::Admin => 'Admin',
        };
    }

    /**
     * Dashboard route name for this role.
     */
    public function dashboardRoute(): string
    {
        return match ($this) {
            self::JobSeeker => 'seeker.dashboard',
            self::Employer => 'employer.dashboard',
            self::Admin => 'admin.dashboard',
        };
    }

    /**
     * @return array<int, string>
     */
    public static function values(): array
    {
        return array_map(static fn (self $r): string => $r->value, self::cases());
    }
}
