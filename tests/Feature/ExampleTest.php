<?php

declare(strict_types=1);

namespace Tests\Feature;

use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ExampleTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RoleSeeder::class);
    }

    public function test_the_homepage_responds_successfully(): void
    {
        $this->get('/')->assertStatus(200);
    }

    public function test_legal_pages_render(): void
    {
        foreach (['privacy', 'terms', 'imprint', 'gdpr'] as $slug) {
            $this->get('/' . $slug)->assertStatus(200);
        }
    }
}
