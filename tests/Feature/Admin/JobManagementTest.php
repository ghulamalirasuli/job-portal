<?php

declare(strict_types=1);

namespace Tests\Feature\Admin;

use App\Enums\JobStatus;
use App\Models\JobPosting;
use App\Models\User;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class JobManagementTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RoleSeeder::class);
    }

    public function test_admin_can_view_jobs_index(): void
    {
        $admin = User::factory()->admin()->create();
        $employer = User::factory()->employer()->create();
        JobPosting::factory()->forEmployer($employer)->create();

        $this
            ->actingAs($admin)
            ->get('/admin/jobs')
            ->assertOk()
            ->assertInertia(fn ($page) => $page->component('Admin/Jobs/Index'));
    }

    public function test_admin_can_approve_pending_job(): void
    {
        $admin = User::factory()->admin()->create();
        $employer = User::factory()->employer()->create();
        $job = JobPosting::factory()->forEmployer($employer)->create([
            'status' => JobStatus::PendingApproval->value,
            'is_active' => false,
        ]);

        $this
            ->actingAs($admin)
            ->patch("/admin/jobs/{$job->id}/approve")
            ->assertRedirect();

        $job->refresh();
        $this->assertSame(JobStatus::Approved, $job->status);
        $this->assertTrue($job->is_active);
        $this->assertNotNull($job->approved_at);
    }

    public function test_admin_can_reject_pending_job(): void
    {
        $admin = User::factory()->admin()->create();
        $employer = User::factory()->employer()->create();
        $job = JobPosting::factory()->forEmployer($employer)->create([
            'status' => JobStatus::PendingApproval->value,
        ]);

        $this
            ->actingAs($admin)
            ->patch("/admin/jobs/{$job->id}/reject", [
                'rejection_reason' => 'Incomplete job description.',
            ])
            ->assertRedirect();

        $job->refresh();
        $this->assertSame(JobStatus::Rejected, $job->status);
        $this->assertSame('Incomplete job description.', $job->rejection_reason);
        $this->assertFalse($job->is_active);
    }

    public function test_non_admin_cannot_view_jobs_index(): void
    {
        $seeker = User::factory()->seeker()->create();

        $this->actingAs($seeker)->get('/admin/jobs')->assertForbidden();
    }
}
