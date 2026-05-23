<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Storage;

/**
 * @property int $id
 * @property int $user_id
 * @property string $company_name
 * @property string|null $company_size
 * @property string|null $industry
 * @property string|null $website
 * @property string|null $vat_number
 * @property string|null $country
 * @property string|null $logo_path
 * @property string|null $description
 * @property Carbon|null $verified_at
 */
class EmployerProfile extends Model
{
    /**
     * @var list<string>
     */
    protected $fillable = [
        'user_id',
        'company_name',
        'company_size',
        'industry',
        'website',
        'vat_number',
        'country',
        'logo_path',
        'description',
        'verified_at',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'verified_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * @return HasMany<JobPosting, $this>
     */
    public function jobPostings(): HasMany
    {
        return $this->hasMany(JobPosting::class);
    }

    public function logoUrl(): ?string
    {
        return $this->logo_path !== null
            ? Storage::disk('public')->url($this->logo_path)
            : null;
    }

    public function isVerified(): bool
    {
        return $this->verified_at !== null;
    }
}
