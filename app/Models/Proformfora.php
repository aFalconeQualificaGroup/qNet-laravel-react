<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

class Proformfora extends Model
{
    use HasFactory, LogsActivity, Notifiable;

    protected $guarded = ['id'];

    protected $casts = [
        'date_proforma'  => 'date:d-m-Y',
    ];

    public function getActivitylogOptions(): LogOptions
    {
        $logOptions = new LogOptions;
        $logOptions->logFillable();
        $logOptions->logOnlyDirty();

        return $logOptions;
    }

    public function getPagamentoAttribute() {
        if ($pagamento = Payment::find($this->payment_id)) {
            return $pagamento->description;
        }
    }

    public function getClienteAttribute() {
        if ($cliente = Customer::find($this->customer_id)) {
            return $cliente->name;
        }
    }
}
