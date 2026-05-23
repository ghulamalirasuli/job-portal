<?php

declare(strict_types=1);

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Http\Requests\Public\StoreContactMessageRequest;
use App\Models\AuditLog;
use App\Models\ContactMessage;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class ContactController extends Controller
{
    public function show(): Response
    {
        return Inertia::render('Public/Contact');
    }

    public function store(StoreContactMessageRequest $request): RedirectResponse
    {
        $data = $request->validated();

        ContactMessage::create([
            'name' => $data['name'],
            'email' => mb_strtolower($data['email']),
            'subject' => $data['subject'],
            'message' => $data['message'],
            'status' => ContactMessage::STATUS_NEW,
            'ip_address' => $request->ip(),
        ]);

        AuditLog::create([
            'event' => 'contact.message.received',
            'user_id' => $request->user()?->id,
            'ip_address' => $request->ip(),
        ]);

        return back()->with('success', __('Thank you. We will get back to you shortly.'));
    }
}
