<?php

declare(strict_types=1);

namespace App\Http\Requests\Seeker;

use Illuminate\Foundation\Http\FormRequest;

class UpdateResumeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->isSeeker() ?? false;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'summary' => ['nullable', 'string', 'max:10000'],
            'experiences' => ['nullable', 'array', 'max:20'],
            'experiences.*.title' => ['required_with:experiences', 'string', 'max:120'],
            'experiences.*.company' => ['required_with:experiences', 'string', 'max:120'],
            'experiences.*.location' => ['nullable', 'string', 'max:120'],
            'experiences.*.start_date' => ['nullable', 'string', 'max:10'],
            'experiences.*.end_date' => ['nullable', 'string', 'max:10'],
            'experiences.*.current' => ['boolean'],
            'experiences.*.description' => ['nullable', 'string', 'max:3000'],
            'education' => ['nullable', 'array', 'max:10'],
            'education.*.school' => ['required_with:education', 'string', 'max:160'],
            'education.*.degree' => ['nullable', 'string', 'max:120'],
            'education.*.field' => ['nullable', 'string', 'max:120'],
            'education.*.start_date' => ['nullable', 'string', 'max:10'],
            'education.*.end_date' => ['nullable', 'string', 'max:10'],
            'skills' => ['nullable', 'array', 'max:30'],
            'skills.*' => ['string', 'max:60'],
            'languages' => ['nullable', 'array', 'max:10'],
            'languages.*.language' => ['required_with:languages', 'string', 'max:60'],
            'languages.*.level' => ['nullable', 'string', 'max:40'],
        ];
    }
}
