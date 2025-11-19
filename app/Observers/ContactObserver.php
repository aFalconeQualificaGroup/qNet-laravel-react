<?php

namespace App\Observers;

use App\Http\Resources\ContactResource;
use App\Models\Contact;
use App\Models\Webhook;
use Spatie\WebhookServer\WebhookCall;

class ContactObserver
{
    public function created(Contact $contact)
    {
        $webhooks = Webhook::where('event', 'contact_create')
            ->where('active', true)
            ->get();

        if (count($webhooks)) {
            $data = Contact::select(
                    'contacts.id',
                    'contacts.name',
                    'contacts.last_name',
                    'contacts.email',
                    'contacts.pec',
                    'contacts.phone',
                    'contacts.mobile',
                    'contacts.fax',
                    'contacts.piva',
                    'contacts.fiscalcode',
                    'contacts.address',
                )
                ->where('contacts.id', $contact->id)
                ->first();

            foreach ($webhooks as $webhook) {
                WebhookCall::create()
                    ->url($webhook->url)
                    ->payload([
                        'entity_type' => 'Contact',
                        'entity_event' => 'created',
                        'entity' => (new ContactResource($data))->resolve(),
                    ])
                    ->useSecret(env('WEBHOOK_CLIENT_SECRET'))
                    ->dispatch();
            }
        }
    }

    public function updated(Contact $contact)
    {
        $webhooks = Webhook::where('event', 'contact_update')
            ->where('active', true)
            ->get();

        if (count($webhooks)) {
            $data = Contact::select(
                    'contacts.id',
                    'contacts.name',
                    'contacts.last_name',
                    'contacts.email',
                    'contacts.pec',
                    'contacts.phone',
                    'contacts.mobile',
                    'contacts.fax',
                    'contacts.piva',
                    'contacts.fiscalcode',
                    'contacts.address',
                )
                ->where('contacts.id', $contact->id)
                ->first();

            foreach ($webhooks as $webhook) {
                WebhookCall::create()
                    ->url($webhook->url)
                    ->payload([
                        'entity_type' => 'Contact',
                        'entity_event' => 'updated',
                        'entity' => (new ContactResource($data))->resolve(),
                    ])
                    ->useSecret(env('WEBHOOK_CLIENT_SECRET'))
                    ->dispatch();
            }
        }
    }

    public function deleted(Contact $contact)
    {
        $webhooks = Webhook::where('event', 'contact_delete')
            ->where('active', true)
            ->get();

        if (count($webhooks)) {
            $data = Contact::select(
                    'contacts.id',
                    'contacts.name',
                    'contacts.last_name',
                    'contacts.email',
                    'contacts.pec',
                    'contacts.phone',
                    'contacts.mobile',
                    'contacts.fax',
                    'contacts.piva',
                    'contacts.fiscalcode',
                    'contacts.address',
                )
                ->where('contacts.id', $contact->id)
                ->first();

            foreach ($webhooks as $webhook) {
                WebhookCall::create()
                    ->url($webhook->url)
                    ->payload([
                        'entity_type' => 'Contact',
                        'entity_event' => 'deleted',
                        'entity' => (new ContactResource($data))->resolve(),
                    ])
                    ->useSecret(env('WEBHOOK_CLIENT_SECRET'))
                    ->dispatch();
            }
        }
    }
}
