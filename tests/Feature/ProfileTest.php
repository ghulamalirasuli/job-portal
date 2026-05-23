<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Models\User;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProfileTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RoleSeeder::class);
    }

    public function test_profile_page_is_displayed(): void
    {
        $user = User::factory()->seeker()->create();
        $this->actingAs($user)->get('/profile')->assertOk();
    }

    public function test_profile_information_can_be_updated(): void
    {
        $user = User::factory()->seeker()->create();

        $response = $this->actingAs($user)->patch('/profile', [
            'name' => 'New Name',
            'email' => 'new@example.com',
            'locale' => 'fr',
        ]);

        $response->assertSessionHasNoErrors();
        $user->refresh();

        $this->assertSame('New Name', $user->name);
        $this->assertSame('new@example.com', $user->email);
        $this->assertSame('fr', $user->locale);
        $this->assertNull($user->email_verified_at);
    }

    public function test_email_verification_status_is_unchanged_when_email_unchanged(): void
    {
        $user = User::factory()->seeker()->create();

        $this->actingAs($user)
            ->patch('/profile', [
                'name' => 'Same Email',
                'email' => $user->email,
                'locale' => 'en',
            ])
            ->assertSessionHasNoErrors();

        $this->assertNotNull($user->refresh()->email_verified_at);
    }

    public function test_user_can_delete_their_account_with_confirmation(): void
    {
        $user = User::factory()->seeker()->create();
        $originalEmail = $user->email;

        $response = $this->actingAs($user)->delete('/profile', [
            'password' => 'password',
            'confirmation' => 'DELETE',
        ]);

        $response->assertSessionHasNoErrors()->assertRedirect('/');
        $this->assertGuest();

        $this->assertDatabaseHas('users', [
            'id' => $user->id,
            'name' => 'Deleted user',
        ]);

        $this->assertDatabaseMissing('users', [
            'id' => $user->id,
            'email' => $originalEmail,
        ]);

        $deleted = User::onlyTrashed()->find($user->id);
        $this->assertNotNull($deleted);
        $this->assertStringEndsWith('@anonymised.invalid', $deleted->email);

        $this->assertDatabaseHas('audit_logs', [
            'event' => 'account.deleted',
            'user_id' => $user->id,
        ]);
    }

    public function test_account_deletion_requires_correct_password(): void
    {
        $user = User::factory()->seeker()->create();

        $this->actingAs($user)->from('/profile')->delete('/profile', [
            'password' => 'wrong',
            'confirmation' => 'DELETE',
        ])->assertSessionHasErrors('password')->assertRedirect('/profile');

        $this->assertNotSoftDeleted($user);
    }

    public function test_account_deletion_requires_typed_confirmation(): void
    {
        $user = User::factory()->seeker()->create();

        $this->actingAs($user)->from('/profile')->delete('/profile', [
            'password' => 'password',
            'confirmation' => 'wrong',
        ])->assertSessionHasErrors('confirmation')->assertRedirect('/profile');

        $this->assertNotSoftDeleted($user);
    }
}
