<?php

declare(strict_types=1);

namespace Tests\Feature\Admin;

use App\Models\User;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UserManagementTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RoleSeeder::class);
    }

    public function test_admin_can_view_users_index(): void
    {
        $admin = User::factory()->admin()->create();
        User::factory()->seeker()->count(2)->create();

        $this
            ->actingAs($admin)
            ->get('/admin/users')
            ->assertOk()
            ->assertInertia(fn ($page) => $page->component('Admin/Users/Index'));
    }

    public function test_non_admin_cannot_view_users_index(): void
    {
        $seeker = User::factory()->seeker()->create();

        $this->actingAs($seeker)->get('/admin/users')->assertForbidden();
    }

    public function test_admin_can_toggle_user_active_status(): void
    {
        $admin = User::factory()->admin()->create();
        $target = User::factory()->seeker()->create(['is_active' => true]);

        $this
            ->actingAs($admin)
            ->patch("/admin/users/{$target->id}/toggle-active")
            ->assertRedirect();

        $this->assertFalse($target->fresh()->is_active);

        $this
            ->actingAs($admin)
            ->patch("/admin/users/{$target->id}/toggle-active")
            ->assertRedirect();

        $this->assertTrue($target->fresh()->is_active);
    }

    public function test_admin_cannot_deactivate_themselves(): void
    {
        $admin = User::factory()->admin()->create(['is_active' => true]);

        $this
            ->actingAs($admin)
            ->patch("/admin/users/{$admin->id}/toggle-active")
            ->assertStatus(422);

        $this->assertTrue($admin->fresh()->is_active);
    }

    public function test_admin_can_soft_delete_user(): void
    {
        $admin = User::factory()->admin()->create();
        $target = User::factory()->seeker()->create();

        $this
            ->actingAs($admin)
            ->delete("/admin/users/{$target->id}")
            ->assertRedirect('/admin/users');

        $this->assertSoftDeleted('users', ['id' => $target->id]);
    }

    public function test_inactive_user_cannot_log_in(): void
    {
        $user = User::factory()->seeker()->create(['is_active' => false]);

        $this
            ->post('/login', [
                'email' => $user->email,
                'password' => 'password',
            ])
            ->assertSessionHasErrors('email');

        $this->assertGuest();
    }

    public function test_admin_can_view_user_detail(): void
    {
        $admin = User::factory()->admin()->create();
        $target = User::factory()->seeker()->create();

        $this
            ->actingAs($admin)
            ->get("/admin/users/{$target->id}")
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('Admin/Users/Show')
                ->where('user.id', $target->id),
            );
    }
}
