<?php

declare(strict_types=1);

namespace Tests\Feature\Admin;

use App\Models\SiteSetting;
use App\Models\User;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class SettingsTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RoleSeeder::class);
    }

    public function test_admin_can_view_settings(): void
    {
        $admin = User::factory()->admin()->create();

        $this
            ->actingAs($admin)
            ->get('/admin/settings')
            ->assertOk()
            ->assertInertia(fn ($page) => $page->component('Admin/Settings'));
    }

    public function test_non_admin_cannot_view_settings(): void
    {
        $seeker = User::factory()->seeker()->create();

        $this->actingAs($seeker)->get('/admin/settings')->assertForbidden();
    }

    public function test_admin_can_update_settings(): void
    {
        $admin = User::factory()->admin()->create();

        $this
            ->actingAs($admin)
            ->post('/admin/settings', [
                'service_name' => 'Job Center',
                'contact_email' => 'hello@example.com',
                'whatsapp' => '+33123456789',
                'phone' => '+33000000000',
                'address' => 'Brussels, BE',
                'about_us' => 'A demo job platform.',
            ])
            ->assertRedirect();

        $settings = SiteSetting::current();
        $this->assertSame('Job Center', $settings->service_name);
        $this->assertSame('hello@example.com', $settings->contact_email);
        $this->assertSame('Brussels, BE', $settings->address);
    }

    public function test_admin_can_upload_logo(): void
    {
        Storage::fake('public');
        $admin = User::factory()->admin()->create();

        $this
            ->actingAs($admin)
            ->post('/admin/settings', [
                'service_name' => 'Job Center',
                'logo' => UploadedFile::fake()->image('logo.png', 200, 200),
            ])
            ->assertRedirect();

        $settings = SiteSetting::current();
        $this->assertNotNull($settings->logo_path);
        Storage::disk('public')->assertExists($settings->logo_path);
    }

    public function test_settings_validation(): void
    {
        $admin = User::factory()->admin()->create();

        $this
            ->actingAs($admin)
            ->post('/admin/settings', [
                'service_name' => '',
                'contact_email' => 'not-an-email',
            ])
            ->assertSessionHasErrors(['service_name', 'contact_email']);
    }
}
