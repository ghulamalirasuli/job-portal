<?php

declare(strict_types=1);

namespace App\Http\Requests\Admin;

use App\Enums\EmploymentType;
use App\Enums\JobStatus;
use App\Enums\PaymentStatus;
use App\Enums\RemoteType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreJobPostingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->isAdmin() ?? false;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'employer_profile_id' => ['required', 'integer', 'exists:employer_profiles,id'],
            'title' => ['required', 'string', 'max:160'],
            'description' => ['required', 'string', 'max:20000'],
            'requirements' => ['nullable', 'string', 'max:10000'],
            'benefits' => ['nullable', 'string', 'max:10000'],
            'location' => ['nullable', 'string', 'max:120'],
            'country' => ['nullable', 'string', 'size:2'],
            'remote_type' => ['required', Rule::in(RemoteType::values())],
            'employment_type' => ['required', Rule::in(EmploymentType::values())],
            'salary_min' => ['nullable', 'integer', 'min:0'],
            'salary_max' => [
                'nullable',
                'integer',
                'min:0',
                Rule::when(
                    fn (): bool => $this->filled('salary_min'),
                    ['gte:salary_min'],
                ),
            ],
            'salary_currency' => ['nullable', 'string', 'size:3'],
            'salary_period' => ['nullable', 'string', 'in:hourly,monthly,yearly'],
            'status' => ['nullable', Rule::in(JobStatus::values())],
            'payment_amount' => ['nullable', 'numeric', 'min:0'],
            'payment_currency' => ['nullable', 'string', 'size:3'],
            'payment_status' => ['nullable', Rule::in(PaymentStatus::values())],
            'payment_reference' => ['nullable', 'string', 'max:120'],
            'payment_method' => ['nullable', 'string', 'max:64'],
            'expires_at' => ['nullable', 'date', 'after:today'],
        ];
    }
}
