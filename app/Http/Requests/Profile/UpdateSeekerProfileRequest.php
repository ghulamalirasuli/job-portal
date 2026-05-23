<?php

declare(strict_types=1);

namespace App\Http\Requests\Profile;

use Illuminate\Foundation\Http\FormRequest;

class UpdateSeekerProfileRequest extends FormRequest
{
    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'headline' => ['nullable', 'string', 'max:140'],
            'location' => ['nullable', 'string', 'max:120'],
            'country' => ['nullable', 'string', 'size:2'],
            'phone' => ['nullable', 'string', 'max:32'],
            'summary' => ['nullable', 'string', 'max:5000'],
            'visibility' => ['required', 'in:public,private'],
            'avatar' => ['nullable', 'image', 'max:2048'],
        ];
    }
}
