<?php

declare(strict_types=1);

namespace App\Models;

use App\Enums\EmploymentType;
use App\Enums\JobStatus;
use App\Enums\PaymentStatus;
use App\Enums\RemoteType;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Carbon;
use Illuminate\Support\Str;

/**
 * @property int $id
 * @property int $employer_profile_id
 * @property int $user_id
 * @property string $title
 * @property string $slug
 * @property string $description
 * @property string|null $requirements
 * @property string|null $benefits
 * @property string|null $location
 * @property string|null $country
 * @property RemoteType $remote_type
 * @property EmploymentType $employment_type
 * @property int|null $salary_min
 * @property int|null $salary_max
 * @property string $salary_currency
 * @property string $salary_period
 * @property JobStatus $status
 * @property string|null $rejection_reason
 * @property bool $is_active
 * @property string|null $payment_amount
 * @property string $payment_currency
 * @property PaymentStatus $payment_status
 * @property string|null $payment_reference
 * @property string|null $payment_method
 * @property Carbon|null $approved_at
 * @property int|null $approved_by
 * @property Carbon|null $rejected_at
 * @property int|null $rejected_by
 * @property Carbon|null $published_at
 * @property Carbon|null $expires_at
 * @property int $views_count
 * @property Carbon|null $deleted_at
 * @property Carbon $created_at
 * @property Carbon $updated_at
 * @property-read EmployerProfile $employerProfile
 * @property-read User $user
 * @property-read User|null $approvedByUser
 * @property-read User|null $rejectedByUser
 */
class JobPosting extends Model
{
    /** @use HasFactory<\Database\Factories\JobPostingFactory> */
    use HasFactory;
    use SoftDeletes;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'employer_profile_id',
        'user_id',
        'title',
        'slug',
        'description',
        'requirements',
        'benefits',
        'location',
        'country',
        'remote_type',
        'employment_type',
        'salary_min',
        'salary_max',
        'salary_currency',
        'salary_period',
        'status',
        'rejection_reason',
        'is_active',
        'payment_amount',
        'payment_currency',
        'payment_status',
        'payment_reference',
        'payment_method',
        'approved_at',
        'approved_by',
        'rejected_at',
        'rejected_by',
        'published_at',
        'expires_at',
        'views_count',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'remote_type' => RemoteType::class,
            'employment_type' => EmploymentType::class,
            'status' => JobStatus::class,
            'payment_status' => PaymentStatus::class,
            'is_active' => 'boolean',
            'payment_amount' => 'decimal:2',
            'approved_at' => 'datetime',
            'rejected_at' => 'datetime',
            'published_at' => 'datetime',
            'expires_at' => 'datetime',
        ];
    }

    protected static function booted(): void
    {
        static::creating(function (JobPosting $job): void {
            if ($job->slug === '') {
                $job->slug = static::uniqueSlug($job->title);
            }
        });
    }

    public static function uniqueSlug(string $title, ?int $ignoreId = null): string
    {
        $base = Str::slug($title);
        $slug = $base;
        $i = 1;

        while (static::query()
            ->when($ignoreId !== null, fn ($q) => $q->where('id', '!=', $ignoreId))
            ->where('slug', $slug)
            ->exists()) {
            $slug = $base . '-' . $i;
            $i++;
        }

        return $slug;
    }

    /**
     * @return BelongsTo<EmployerProfile, $this>
     */
    public function employerProfile(): BelongsTo
    {
        return $this->belongsTo(EmployerProfile::class);
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function approvedByUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function rejectedByUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'rejected_by');
    }

    public function isPending(): bool
    {
        return $this->status === JobStatus::PendingApproval;
    }

    public function isApproved(): bool
    {
        return $this->status === JobStatus::Approved;
    }

    public function formattedSalary(): ?string
    {
        if ($this->salary_min === null && $this->salary_max === null) {
            return null;
        }

        $currency = $this->salary_currency;
        $period = match ($this->salary_period) {
            'hourly' => '/hr',
            'monthly' => '/mo',
            default => '/yr',
        };

        if ($this->salary_min !== null && $this->salary_max !== null) {
            return sprintf(
                '%s %s – %s %s',
                number_format($this->salary_min),
                $currency,
                number_format($this->salary_max),
                $period,
            );
        }

        $amount = $this->salary_min ?? $this->salary_max;

        return sprintf('%s %s%s', number_format((int) $amount), $currency, $period);
    }
}
