<?php

declare(strict_types=1);

use App\Http\Controllers\Admin\CompanyController as AdminCompanyController;
use App\Http\Controllers\Admin\ContactMessageController as AdminContactMessageController;
use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Admin\EmployeeController as AdminEmployeeController;
use App\Http\Controllers\Admin\JobController as AdminJobController;
use App\Http\Controllers\Admin\SettingsController as AdminSettingsController;
use App\Http\Controllers\Admin\TrashController as AdminTrashController;
use App\Http\Controllers\Admin\UserController as AdminUserController;
use App\Http\Controllers\Employer\DashboardController as EmployerDashboardController;
use App\Http\Controllers\Employer\ProfileController as EmployerProfileController;
use App\Http\Controllers\LocaleController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Public\CompanyListingController;
use App\Http\Controllers\Public\ContactController;
use App\Http\Controllers\Public\JobListingController;
use App\Http\Controllers\Public\WelcomeController;
use App\Http\Controllers\Seeker\DashboardController as SeekerDashboardController;
use App\Http\Controllers\Seeker\ProfileController as SeekerProfileController;
use App\Http\Controllers\Seeker\ResumeController as SeekerResumeController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', WelcomeController::class)->name('home');

Route::post('/locale', [LocaleController::class, 'update'])->name('locale.update');

// Public pages
Route::get('/jobs', [JobListingController::class, 'index'])->name('jobs');
Route::get('/jobs/{slug}', [JobListingController::class, 'show'])->name('jobs.show');

Route::get('/companies', [CompanyListingController::class, 'index'])->name('companies');
Route::get('/companies/{id}', [CompanyListingController::class, 'show'])
    ->whereNumber('id')
    ->name('companies.show');

Route::get('/employers', fn () => Inertia::render('Public/ForEmployers'))->name('employers');

Route::get('/about', fn () => Inertia::render('Public/About'))->name('about');
Route::get('/contact', [ContactController::class, 'show'])->name('contact');
Route::post('/contact', [ContactController::class, 'store'])->name('contact.store');

// Generic /dashboard — redirects to the role-specific dashboard.
Route::get('/dashboard', function () {
    $user = auth()->user();
    if ($user === null) {
        return redirect()->route('login');
    }

    return redirect()->route($user->role->dashboardRoute());
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware(['auth', 'verified', 'role:job_seeker'])->prefix('seeker')->name('seeker.')->group(function (): void {
    Route::get('/', SeekerDashboardController::class)->name('dashboard');
    Route::get('/profile', [SeekerProfileController::class, 'edit'])->name('profile');
    Route::post('/profile', [SeekerProfileController::class, 'update'])->name('profile.update');
    Route::get('/resume', [SeekerResumeController::class, 'edit'])->name('resume');
    Route::post('/resume', [SeekerResumeController::class, 'update'])->name('resume.update');
});

Route::middleware(['auth', 'verified', 'role:employer'])->prefix('employer')->name('employer.')->group(function (): void {
    Route::get('/', EmployerDashboardController::class)->name('dashboard');
    Route::get('/profile', [EmployerProfileController::class, 'edit'])->name('profile');
    Route::post('/profile', [EmployerProfileController::class, 'update'])->name('profile.update');
});

Route::middleware(['auth', 'verified', 'role:admin'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function (): void {
        Route::get('/', AdminDashboardController::class)->name('dashboard');

        Route::get('users', [AdminUserController::class, 'index'])->name('users.index');
        Route::get('users/{id}', [AdminUserController::class, 'show'])
            ->whereNumber('id')
            ->name('users.show');
        Route::patch('users/{id}/toggle-active', [AdminUserController::class, 'toggleActive'])
            ->whereNumber('id')
            ->name('users.toggle-active');
        Route::delete('users/{id}', [AdminUserController::class, 'destroy'])
            ->whereNumber('id')
            ->name('users.destroy');

        Route::get('companies', [AdminCompanyController::class, 'index'])->name('companies.index');
        Route::get('companies/create', [AdminCompanyController::class, 'create'])->name('companies.create');
        Route::post('companies', [AdminCompanyController::class, 'store'])->name('companies.store');
        Route::get('companies/{id}/edit', [AdminCompanyController::class, 'edit'])
            ->whereNumber('id')
            ->name('companies.edit');
        Route::post('companies/{id}', [AdminCompanyController::class, 'update'])
            ->whereNumber('id')
            ->name('companies.update');
        Route::patch('companies/{id}/toggle-active', [AdminCompanyController::class, 'toggleActive'])
            ->whereNumber('id')
            ->name('companies.toggle-active');
        Route::patch('companies/{id}/toggle-verified', [AdminCompanyController::class, 'toggleVerified'])
            ->whereNumber('id')
            ->name('companies.toggle-verified');
        Route::delete('companies/{id}', [AdminCompanyController::class, 'destroy'])
            ->whereNumber('id')
            ->name('companies.destroy');

        Route::get('employees', [AdminEmployeeController::class, 'index'])->name('employees.index');
        Route::get('employees/create', [AdminEmployeeController::class, 'create'])->name('employees.create');
        Route::post('employees', [AdminEmployeeController::class, 'store'])->name('employees.store');
        Route::get('employees/{id}/edit', [AdminEmployeeController::class, 'edit'])
            ->whereNumber('id')
            ->name('employees.edit');
        Route::post('employees/{id}', [AdminEmployeeController::class, 'update'])
            ->whereNumber('id')
            ->name('employees.update');
        Route::patch('employees/{id}/toggle-active', [AdminEmployeeController::class, 'toggleActive'])
            ->whereNumber('id')
            ->name('employees.toggle-active');
        Route::delete('employees/{id}', [AdminEmployeeController::class, 'destroy'])
            ->whereNumber('id')
            ->name('employees.destroy');

        Route::get('jobs', [AdminJobController::class, 'index'])->name('jobs.index');
        Route::get('jobs/create', [AdminJobController::class, 'create'])->name('jobs.create');
        Route::post('jobs', [AdminJobController::class, 'store'])->name('jobs.store');
        Route::get('jobs/{id}/edit', [AdminJobController::class, 'edit'])
            ->whereNumber('id')
            ->name('jobs.edit');
        Route::post('jobs/{id}', [AdminJobController::class, 'update'])
            ->whereNumber('id')
            ->name('jobs.update');
        Route::patch('jobs/{id}/approve', [AdminJobController::class, 'approve'])
            ->whereNumber('id')
            ->name('jobs.approve');
        Route::patch('jobs/{id}/reject', [AdminJobController::class, 'reject'])
            ->whereNumber('id')
            ->name('jobs.reject');
        Route::patch('jobs/{id}/toggle-active', [AdminJobController::class, 'toggleActive'])
            ->whereNumber('id')
            ->name('jobs.toggle-active');
        Route::delete('jobs/{id}', [AdminJobController::class, 'destroy'])
            ->whereNumber('id')
            ->name('jobs.destroy');

        Route::get('trash', [AdminTrashController::class, 'index'])->name('trash.index');
        Route::post('trash/{id}/restore', [AdminTrashController::class, 'restore'])
            ->whereNumber('id')
            ->name('trash.restore');
        Route::delete('trash/{id}', [AdminTrashController::class, 'forceDelete'])
            ->whereNumber('id')
            ->name('trash.force-delete');

        Route::get('settings', [AdminSettingsController::class, 'edit'])->name('settings.edit');
        Route::post('settings', [AdminSettingsController::class, 'update'])->name('settings.update');

        Route::get('contact-messages', [AdminContactMessageController::class, 'index'])->name('contact-messages.index');
        Route::get('contact-messages/{id}', [AdminContactMessageController::class, 'show'])
            ->whereNumber('id')
            ->name('contact-messages.show');
        Route::delete('contact-messages/{id}', [AdminContactMessageController::class, 'destroy'])
            ->whereNumber('id')
            ->name('contact-messages.destroy');
    });

Route::middleware('auth')->group(function (): void {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// GDPR / legal placeholders — fleshed out in Phase 8.
foreach (['privacy', 'terms', 'imprint', 'gdpr'] as $slug) {
    Route::get("/{$slug}", fn () => Inertia::render('Public/Legal', ['slug' => $slug]))->name($slug);
}

require __DIR__ . '/auth.php';
