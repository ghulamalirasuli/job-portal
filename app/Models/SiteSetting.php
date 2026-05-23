<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Storage;

/**
 * @property int $id
 * @property string $service_name
 * @property string|null $logo_path
 * @property string|null $contact_email
 * @property string|null $whatsapp
 * @property string|null $phone
 * @property string|null $address
 * @property string|null $about_us
 * @property Carbon $created_at
 * @property Carbon $updated_at
 */
class SiteSetting extends Model
{
    /**
     * @var list<string>
     */
    protected $fillable = [
        'service_name',
        'logo_path',
        'contact_email',
        'whatsapp',
        'phone',
        'address',
        'about_us',
    ];

    /**
     * Singleton accessor — there is only ever one row.
     */
    public static function current(): self
    {
        return static::query()->firstOrCreate([], [
            'service_name' => config('app.name', 'Europa Jobs'),
        ]);
    }

    public function logoUrl(): ?string
    {
        return $this->logo_path !== null
            ? Storage::disk('public')->url($this->logo_path)
            : null;
    }
}
