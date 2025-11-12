<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Notifications\Notifiable;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

class Proforma extends Model
{
    use HasFactory, LogsActivity, Notifiable;

    protected $guarded = ['id'];

    protected $casts = [
        'date_proforma'  => 'date:d-m-Y',
        'date_pf_internal_number' => 'date:d-m-Y',
    ];

    public function scadenze() {
    	return $this->hasMany(Schedule::class, 'document_number', 'progressive');
    }

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

    public function getUnitaAziendaleAttribute() {
        if ($ua = CompanyProfile::find($this->business_unit)) {
            return $ua->name;
        }
    }

    public function getIncassatoAttribute() {
        $totale = Schedule::where('document_number', $this->progressive)
            ->where('status', 3)
            ->sum('amount');

        return $totale;
    }

    public function getResiduoAttribute() {
        $totale_incassato = Schedule::where('document_number', $this->progressive)
            ->where('status', 3)
            ->sum('amount');

        return $this->totale - $totale_incassato;
    }

}
