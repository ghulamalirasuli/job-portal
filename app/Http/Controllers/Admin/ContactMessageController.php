<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ContactMessage;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ContactMessageController extends Controller
{
    public function index(Request $request): Response
    {
        $validated = $request->validate([
            'status' => ['nullable', 'string', 'in:new,read,all'],
            'page' => ['nullable', 'integer', 'min:1'],
        ]);

        $query = ContactMessage::query()->latest('created_at');

        $status = $validated['status'] ?? 'all';
        if ($status === 'new') {
            $query->where('status', ContactMessage::STATUS_NEW);
        } elseif ($status === 'read') {
            $query->where('status', ContactMessage::STATUS_READ);
        }

        $messages = $query
            ->paginate(20)
            ->withQueryString()
            ->through(fn (ContactMessage $m): array => [
                'id' => $m->id,
                'name' => $m->name,
                'email' => $m->email,
                'subject' => $m->subject,
                'message' => $m->message,
                'status' => $m->status,
                'is_unread' => $m->isUnread(),
                'created_at' => $m->created_at?->toIso8601String(),
            ]);

        return Inertia::render('Admin/ContactMessages/Index', [
            'messages' => $messages,
            'filters' => ['status' => $status],
            'counts' => [
                'new' => ContactMessage::query()->where('status', ContactMessage::STATUS_NEW)->count(),
                'total' => ContactMessage::count(),
            ],
        ]);
    }

    public function show(int $id): Response
    {
        /** @var ContactMessage $message */
        $message = ContactMessage::findOrFail($id);
        $message->markAsRead();

        return Inertia::render('Admin/ContactMessages/Show', [
            'message' => [
                'id' => $message->id,
                'name' => $message->name,
                'email' => $message->email,
                'subject' => $message->subject,
                'message' => $message->message,
                'status' => $message->status,
                'ip_address' => $message->ip_address,
                'created_at' => $message->created_at?->toIso8601String(),
                'read_at' => $message->read_at?->toIso8601String(),
            ],
        ]);
    }

    public function destroy(Request $request, int $id): RedirectResponse
    {
        ContactMessage::findOrFail($id)->delete();

        return redirect()
            ->route('admin.contact-messages.index')
            ->with('success', __('Message deleted.'));
    }
}
