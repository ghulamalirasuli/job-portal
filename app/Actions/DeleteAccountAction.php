<?php

declare(strict_types=1);

namespace App\Actions;

use App\Models\AuditLog;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

/**
 * GDPR account deletion: anonymises personal data, removes related profile rows,
 * soft-deletes the user account, and writes a no-PII audit log entry.
 */
class DeleteAccountAction
{
    public function execute(User $user, ?string $ipAddress = null): void
    {
        DB::transaction(function () use ($user, $ipAddress): void {
            $originalId = $user->id;
            $anonymousEmail = sprintf('deleted-%s@anonymised.invalid', Str::uuid()->toString());

            $user->seekerProfile?->delete();
            $user->employerProfile?->delete();

            $user->forceFill([
                'name' => 'Deleted user',
                'email' => $anonymousEmail,
                'avatar_path' => null,
                'last_login_ip' => null,
                'remember_token' => null,
            ])->saveQuietly();

            $user->syncRoles([]);

            $user->delete();

            AuditLog::create([
                'event' => 'account.deleted',
                'user_id' => $originalId,
                'ip_address' => $ipAddress,
                'context' => ['anonymised' => true],
            ]);
        });
    }
}
