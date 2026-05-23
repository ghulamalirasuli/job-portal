<?php

declare(strict_types=1);

namespace Tests\Feature\Admin;

use App\Enums\JobStatus;
use App\Models\JobPosting;
use App\Models\User;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CompanyManagementTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RoleSeeder::class);
    }

    public function test_admin_can_view_companies_index(): void
    {
        $admin = User::factory()->admin()->create();
        User::factory()->employer()->count(2)->create();

        $this
            ->actingAs($admin)
            ->get('/admin/companies')
            ->assertOk()
            ->assertInertia(fn ($page) => $page->component('Admin/Companies/Index'));
    }

    public function test_admin_can_create_company(): void
    {
        $admin = User::factory()->admin()->create();

        $this
            ->actingAs($admin)
            ->post('/admin/companies', [
                'name' => 'Jane Employer',
                'email' => 'jane@company.test',
                'password' => 'password123',
                'company_name' => 'Acme EU GmbH',
                'country' => 'DE',
                'is_active' => true,
                'is_verified' => true,
            ])
            ->assertRedirect();

        $this->assertDatabaseHas('users', [
            'email' => 'jane@company.test',
            'role' => 'employer',
        ]);
        $this->assertDatabaseHas('employer_profiles', [
            'company_name' => 'Acme EU GmbH',
        ]);
    }

    public function test_admin_can_toggle_company_active_status(): void
    {
        $admin = User::factory()->admin()->create();
        $employer = User::factory()->employer()->create(['is_active' => true]);

        $this
            ->actingAs($admin)
            ->patch("/admin/companies/{$employer->id}/toggle-active")
            ->assertRedirect();

        $this->assertFalse($employer->fresh()->is_active);
    }
}
