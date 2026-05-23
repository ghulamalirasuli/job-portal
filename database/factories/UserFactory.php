<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * @extends Factory<User>
 */
class UserFactory extends Factory
{
    protected static ?string $password = null;

    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'email_verified_at' => now(),
            'password' => static::$password ??= Hash::make('password'),
            'role' => UserRole::JobSeeker,
            'locale' => 'en',
            'remember_token' => Str::random(10),
        ];
    }

    public function unverified(): static
    {
        return $this->state(fn (array $attributes): array => [
            'email_verified_at' => null,
        ]);
    }

    public function seeker(): static
    {
        return $this->state(fn (array $attributes): array => [
            'role' => UserRole::JobSeeker,
        ])->afterCreating(function (User $user): void {
            $user->seekerProfile()->create(['visibility' => 'private']);
            $user->syncRoles([UserRole::JobSeeker->value]);
        });
    }

    public function employer(): static
    {
        return $this->state(fn (array $attributes): array => [
            'role' => UserRole::Employer,
        ])->afterCreating(function (User $user): void {
            $user->employerProfile()->create([
                'company_name' => fake()->company(),
                'country' => fake()->countryCode(),
            ]);
            $user->syncRoles([UserRole::Employer->value]);
        });
    }

    public function admin(): static
    {
        return $this->state(fn (array $attributes): array => [
            'role' => UserRole::Admin,
        ])->afterCreating(function (User $user): void {
            $user->syncRoles([UserRole::Admin->value]);
        });
    }
}
