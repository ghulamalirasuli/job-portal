<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property string $event
 * @property int|null $user_id
 * @property string|null $ip_address
 * @property array<string, mixed>|null $context
 * @property Carbon $created_at
 */
class AuditLog extends Model
{
    /**
     * @var list<string>
     */
    protected $fillable = [
        'event',
        'user_id',
        'ip_address',
        'context',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'context' => 'array',
        ];
    }
}
