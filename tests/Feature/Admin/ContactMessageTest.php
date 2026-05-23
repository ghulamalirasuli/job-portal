<?php

declare(strict_types=1);

namespace Tests\Feature\Admin;

use App\Models\ContactMessage;
use App\Models\User;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ContactMessageTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RoleSeeder::class);
    }

    public function test_admin_can_view_contact_messages(): void
    {
        $admin = User::factory()->admin()->create();
        ContactMessage::create([
            'name' => 'Jane',
            'email' => 'jane@test.com',
            'subject' => 'Hello',
            'message' => 'This is a long enough test message for validation.',
            'status' => ContactMessage::STATUS_NEW,
        ]);

        $this->actingAs($admin)
            ->get('/admin/contact-messages')
            ->assertOk()
            ->assertInertia(fn ($page) => $page->component('Admin/ContactMessages/Index'));
    }
}
