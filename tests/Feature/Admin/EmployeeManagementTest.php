<?php

declare(strict_types=1);

namespace Tests\Feature\Admin;

use App\Models\User;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class EmployeeManagementTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RoleSeeder::class);
    }

    public function test_admin_can_view_employees_index(): void
    {
        $admin = User::factory()->admin()->create();
        User::factory()->seeker()->count(2)->create();

        $this
            ->actingAs($admin)
            ->get('/admin/employees')
            ->assertOk()
            ->assertInertia(fn ($page) => $page->component('Admin/Employees/Index'));
    }

    public function test_admin_can_create_employee(): void
    {
        $admin = User::factory()->admin()->create();

        $this
            ->actingAs($admin)
            ->post('/admin/employees', [
                'name' => 'Lucas Martin',
                'email' => 'lucas@seeker.test',
                'password' => 'password123',
                'headline' => 'Backend Engineer',
                'visibility' => 'public',
                'is_active' => true,
            ])
            ->assertRedirect();

        $this->assertDatabaseHas('users', [
            'email' => 'lucas@seeker.test',
            'role' => 'job_seeker',
        ]);
        $this->assertDatabaseHas('seeker_profiles', [
            'headline' => 'Backend Engineer',
            'visibility' => 'public',
        ]);
    }

    public function test_admin_can_toggle_employee_active_status(): void
    {
        $admin = User::factory()->admin()->create();
        $seeker = User::factory()->seeker()->create(['is_active' => true]);

        $this
            ->actingAs($admin)
            ->patch("/admin/employees/{$seeker->id}/toggle-active")
            ->assertRedirect();

        $this->assertFalse($seeker->fresh()->is_active);
    }
}
