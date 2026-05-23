<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Models\User;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class LocaleTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RoleSeeder::class);
    }

    public function test_locale_endpoint_persists_locale_for_authenticated_user(): void
    {
        $user = User::factory()->seeker()->create(['locale' => 'en']);

        $this->actingAs($user)
            ->postJson('/locale', ['locale' => 'fr'])
            ->assertOk()
            ->assertJson(['locale' => 'fr']);

        $this->assertSame('fr', $user->refresh()->locale);
    }

    public function test_locale_endpoint_rejects_unsupported_locale(): void
    {
        $user = User::factory()->seeker()->create();

        $this->actingAs($user)
            ->postJson('/locale', ['locale' => 'zz'])
            ->assertStatus(422)
            ->assertJsonValidationErrors('locale');
    }

    public function test_locale_endpoint_works_for_guests(): void
    {
        $this->postJson('/locale', ['locale' => 'de'])
            ->assertOk()
            ->assertJson(['locale' => 'de']);
    }
}
