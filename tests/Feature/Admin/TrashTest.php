<?php

declare(strict_types=1);

namespace Tests\Feature\Admin;

use App\Models\User;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TrashTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RoleSeeder::class);
    }

    public function test_admin_can_view_trash(): void
    {
        $admin = User::factory()->admin()->create();
        $deleted = User::factory()->seeker()->create();
        $deleted->delete();

        $this
            ->actingAs($admin)
            ->get('/admin/trash')
            ->assertOk()
            ->assertInertia(fn ($page) => $page->component('Admin/Trash'));
    }

    public function test_admin_can_restore_soft_deleted_user(): void
    {
        $admin = User::factory()->admin()->create();
        $target = User::factory()->seeker()->create(['is_active' => false]);
        $target->delete();

        $this
            ->actingAs($admin)
            ->post("/admin/trash/{$target->id}/restore")
            ->assertRedirect();

        $restored = User::find($target->id);
        $this->assertNotNull($restored);
        $this->assertNull($restored?->deleted_at);
        $this->assertTrue($restored?->is_active);
    }

    public function test_admin_can_force_delete_user(): void
    {
        $admin = User::factory()->admin()->create();
        $target = User::factory()->seeker()->create();
        $target->delete();

        $this
            ->actingAs($admin)
            ->delete("/admin/trash/{$target->id}")
            ->assertRedirect();

        $this->assertDatabaseMissing('users', ['id' => $target->id]);
    }
}
