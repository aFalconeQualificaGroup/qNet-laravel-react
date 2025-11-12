<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

class Invoice extends Model
{
    use HasFactory, LogsActivity, Notifiable;

    protected $guarded = ['id'];

    protected $casts = [
        'date_invoice'  => 'date:d-m-Y',
        'date_internal_number' => 'date:d-m-Y',
    ];

    public function getActivitylogOptions(): LogOptions
    {
        $logOptions = new LogOptions;
        $logOptions->logFillable();
        $logOptions->logOnlyDirty();

        return $logOptions;
    }

    public function invoiceservices() {
    	return $this->hasMany(InvoiceService::class);
    }

    public function getPagamentoAttribute() {
        $pagamento = Payment::find($this->payment_id);
        if (!empty($pagamento)) {
            $descrizione = $pagamento->description;
        }
        else {
            $descrizione = '';
        }

        return $descrizione;
    }

    public function getClienteAttribute() {
        $cliente = Customer::find($this->customer_id);
        if (!empty($cliente)) {
            $name = $cliente->name;
        }
        else {
            $name = '';
        }

        return $name;
    }

}
