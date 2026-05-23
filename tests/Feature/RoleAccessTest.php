<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Models\User;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RoleAccessTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RoleSeeder::class);
    }

    public function test_seeker_can_access_seeker_dashboard(): void
    {
        $user = User::factory()->seeker()->create();
        $this->actingAs($user)->get('/seeker')->assertOk();
    }

    public function test_seeker_cannot_access_employer_dashboard(): void
    {
        $user = User::factory()->seeker()->create();
        $this->actingAs($user)->get('/employer')->assertForbidden();
    }

    public function test_seeker_cannot_access_admin_dashboard(): void
    {
        $user = User::factory()->seeker()->create();
        $this->actingAs($user)->get('/admin')->assertForbidden();
    }

    public function test_employer_can_access_employer_dashboard(): void
    {
        $user = User::factory()->employer()->create();
        $this->actingAs($user)->get('/employer')->assertOk();
    }

    public function test_employer_cannot_access_seeker_dashboard(): void
    {
        $user = User::factory()->employer()->create();
        $this->actingAs($user)->get('/seeker')->assertForbidden();
    }

    public function test_admin_can_access_admin_dashboard(): void
    {
        $user = User::factory()->admin()->create();
        $this->actingAs($user)->get('/admin')->assertOk();
    }

    public function test_guest_cannot_access_any_role_dashboard(): void
    {
        $this->get('/seeker')->assertRedirect('/login');
        $this->get('/employer')->assertRedirect('/login');
        $this->get('/admin')->assertRedirect('/login');
    }

    public function test_generic_dashboard_redirects_to_role_specific_dashboard(): void
    {
        $seeker = User::factory()->seeker()->create();
        $this->actingAs($seeker)->get('/dashboard')->assertRedirect(route('seeker.dashboard'));

        $employer = User::factory()->employer()->create();
        $this->actingAs($employer)->get('/dashboard')->assertRedirect(route('employer.dashboard'));

        $admin = User::factory()->admin()->create();
        $this->actingAs($admin)->get('/dashboard')->assertRedirect(route('admin.dashboard'));
    }
}
