<?php

declare(strict_types=1);

namespace Tests\Feature\Public;

use App\Models\ContactMessage;
use App\Models\User;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ContactPageTest extends TestCase
{
    use RefreshDatabase;

    public function test_contact_page_renders(): void
    {
        $this->get('/contact')
            ->assertOk()
            ->assertInertia(fn ($page) => $page->component('Public/Contact'));
    }

    public function test_visitor_can_submit_contact_form(): void
    {
        $this->post('/contact', [
            'name' => 'Jane Doe',
            'email' => 'jane@example.com',
            'subject' => 'Employer onboarding',
            'message' => 'We would like to post jobs on your platform for our company.',
        ])->assertRedirect();

        $this->assertDatabaseHas('contact_messages', [
            'email' => 'jane@example.com',
            'subject' => 'Employer onboarding',
            'status' => ContactMessage::STATUS_NEW,
        ]);
    }

    public function test_jobs_page_renders(): void
    {
        $this->get('/jobs')
            ->assertOk()
            ->assertInertia(fn ($page) => $page->component('Public/Jobs/Index'));
    }

    public function test_seeker_can_open_resume_builder(): void
    {
        $this->seed(RoleSeeder::class);
        $seeker = User::factory()->seeker()->create();

        $this->actingAs($seeker)
            ->get('/seeker/resume')
            ->assertOk()
            ->assertInertia(fn ($page) => $page->component('Seeker/Resume/Builder'));
    }

    public function test_seeker_can_save_resume(): void
    {
        $this->seed(RoleSeeder::class);
        $seeker = User::factory()->seeker()->create();

        $this->actingAs($seeker)->post('/seeker/resume', [
            'summary' => '<p>Experienced engineer</p>',
            'experiences' => [[
                'title' => 'Backend Engineer',
                'company' => 'Acme GmbH',
                'location' => 'Berlin',
                'start_date' => '2022-01',
                'end_date' => '',
                'current' => true,
                'description' => 'Built APIs',
            ]],
            'education' => [[
                'school' => 'TU Berlin',
                'degree' => 'MSc',
                'field' => 'Computer Science',
                'start_date' => '2018-01',
                'end_date' => '2020-06',
            ]],
            'skills' => ['PHP', 'Laravel'],
            'languages' => [['language' => 'English', 'level' => 'Fluent']],
        ])->assertRedirect();

        $profile = $seeker->fresh()->seekerProfile;
        $this->assertNotNull($profile);
        $this->assertSame('PHP', $profile->resumeData()['skills'][0] ?? null);
    }
}
