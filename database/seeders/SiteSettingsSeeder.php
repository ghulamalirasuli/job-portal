<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\SiteSetting;
use Illuminate\Database\Seeder;

class SiteSettingsSeeder extends Seeder
{
    public function run(): void
    {
        SiteSetting::query()->updateOrCreate(
            ['id' => 1],
            [
                'service_name' => 'Europa Jobs',
                'contact_email' => 'hello@europa.jobs',
                'phone' => '+49 30 1234 5678',
                'whatsapp' => '+49 170 1234567',
                'address' => 'Friedrichstraße 68, 10117 Berlin, Germany',
                'about_us' => 'Europa Jobs connects job seekers and employers across Europe with verified listings, structured profiles, and GDPR-first hiring tools.',
            ],
        );
    }
}
