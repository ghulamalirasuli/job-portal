<?php

declare(strict_types=1);

namespace Tests\Feature\Auth;

use App\Enums\UserRole;
use App\Models\User;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RegistrationTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RoleSeeder::class);
    }

    public function test_register_chooser_screen_renders(): void
    {
        $this->get('/register')->assertStatus(200);
    }

    public function test_seeker_registration_screen_renders(): void
    {
        $this->get('/register/seeker')->assertStatus(200);
    }

    public function test_employer_registration_screen_renders(): void
    {
        $this->get('/register/employer')->assertStatus(200);
    }

    public function test_register_redirects_to_seeker_when_role_query_is_seeker(): void
    {
        $this->get('/register?role=job_seeker')->assertRedirect('/register/seeker');
    }

    public function test_register_redirects_to_employer_when_role_query_is_employer(): void
    {
        $this->get('/register?role=employer')->assertRedirect('/register/employer');
    }

    public function test_seeker_can_register_and_is_redirected_to_seeker_dashboard(): void
    {
        $response = $this->post('/register/seeker', [
            'name' => 'Lucas Martin',
            'email' => 'lucas@example.com',
            'password' => 'Secret123',
            'password_confirmation' => 'Secret123',
            'terms' => '1',
        ]);

        $this->assertAuthenticated();
        $response->assertRedirect(route('seeker.dashboard', absolute: false));

        $user = User::firstWhere('email', 'lucas@example.com');
        $this->assertNotNull($user);
        $this->assertSame(UserRole::JobSeeker, $user->role);
        $this->assertNotNull($user->seekerProfile);
        $this->assertTrue($user->hasRole(UserRole::JobSeeker->value));
    }

    public function test_employer_can_register_and_is_redirected_to_employer_dashboard(): void
    {
        $response = $this->post('/register/employer', [
            'name' => 'Anya Müller',
            'email' => 'anya@example.com',
            'password' => 'Secret123',
            'password_confirmation' => 'Secret123',
            'company_name' => 'Berlin TechWorks GmbH',
            'country' => 'DE',
            'terms' => '1',
        ]);

        $this->assertAuthenticated();
        $response->assertRedirect(route('employer.dashboard', absolute: false));

        $user = User::firstWhere('email', 'anya@example.com');
        $this->assertNotNull($user);
        $this->assertSame(UserRole::Employer, $user->role);
        $this->assertNotNull($user->employerProfile);
        $this->assertSame('Berlin TechWorks GmbH', $user->employerProfile->company_name);
        $this->assertSame('DE', $user->employerProfile->country);
        $this->assertTrue($user->hasRole(UserRole::Employer->value));
    }

    public function test_seeker_registration_validates_required_fields(): void
    {
        $this->from('/register/seeker')
            ->post('/register/seeker', [])
            ->assertRedirect('/register/seeker')
            ->assertSessionHasErrors(['name', 'email', 'password', 'terms']);
    }

    public function test_employer_registration_validates_required_fields(): void
    {
        $this->from('/register/employer')
            ->post('/register/employer', [])
            ->assertRedirect('/register/employer')
            ->assertSessionHasErrors(['name', 'email', 'password', 'company_name', 'country', 'terms']);
    }

    public function test_seeker_registration_rejects_weak_password(): void
    {
        $this->from('/register/seeker')
            ->post('/register/seeker', [
                'name' => 'Lucas Martin',
                'email' => 'lucas@example.com',
                'password' => 'short',
                'password_confirmation' => 'short',
                'terms' => '1',
            ])
            ->assertSessionHasErrors('password');
    }

    public function test_seeker_registration_rejects_duplicate_email(): void
    {
        User::factory()->seeker()->create(['email' => 'taken@example.com']);

        $this->from('/register/seeker')
            ->post('/register/seeker', [
                'name' => 'Lucas Martin',
                'email' => 'taken@example.com',
                'password' => 'Secret123',
                'password_confirmation' => 'Secret123',
                'terms' => '1',
            ])
            ->assertSessionHasErrors('email');
    }
}
