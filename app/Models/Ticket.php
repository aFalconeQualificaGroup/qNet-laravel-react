<?php

namespace App\Models;

use App\Models\TicketDocument;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

class Ticket extends Model
{
    use HasFactory, LogsActivity, Notifiable;

    protected $guarded = [
        'id'
    ];

    protected $casts = [
        'dateticket' => 'date:d-m-Y H:i',
    ];

    public function getActivitylogOptions(): LogOptions
    {
        $logOptions = new LogOptions;
        $logOptions->logFillable();
        $logOptions->logOnlyDirty();

        return $logOptions;
    }

    public function documents() {
        return $this->hasMany(TicketDocument::class, 'ticket_id');
    }

    public function user() {
        return $this->hasOne(User::class, 'id', 'user_id');
    }

    public function company() {
        return $this->hasOne(Company::class, 'id', 'customer_id');
    }

    public function getClienteAttribute() {
        if ($customer = Company::find($this->customer_id)) {
            return $customer->name;
        }
    }

    public function getGestoreAttribute() {
        if ($gestore = User::find($this->user_id)) {
            return $gestore->last_name . ' ' . $gestore->name;
        }
    }

}
