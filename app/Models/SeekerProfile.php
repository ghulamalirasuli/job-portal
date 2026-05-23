<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property int $id
 * @property int $user_id
 * @property string|null $headline
 * @property string|null $location
 * @property string|null $country
 * @property string|null $phone
 * @property string|null $summary
 * @property 'public'|'private' $visibility
 */
class SeekerProfile extends Model
{
    /**
     * @var list<string>
     */
    protected $fillable = [
        'user_id',
        'headline',
        'location',
        'country',
        'phone',
        'summary',
        'visibility',
        'resume_data',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'resume_data' => 'array',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * @return array<string, mixed>
     */
    public function resumeData(): array
    {
        $defaults = [
            'summary' => '',
            'experiences' => [],
            'education' => [],
            'skills' => [],
            'languages' => [],
        ];

        if (! is_array($this->resume_data)) {
            return $defaults;
        }

        return array_merge($defaults, $this->resume_data);
    }

    public function resumeCompleteness(): int
    {
        $resume = $this->resumeData();
        $checks = [
            ! empty($this->headline),
            ! empty(trim(strip_tags((string) ($resume['summary'] ?? '')))),
            count($resume['experiences'] ?? []) > 0,
            count($resume['education'] ?? []) > 0,
            count($resume['skills'] ?? []) > 0,
        ];

        $done = count(array_filter($checks));

        return (int) round(($done / count($checks)) * 100);
    }
}
