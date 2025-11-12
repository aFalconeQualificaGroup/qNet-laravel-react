<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;


class ProformaEnte extends Model
{
    protected $table="proforma_ente";

    protected $guarded = ['id'];

    protected $casts = [
        'date_proforma'  => 'date:d-m-Y',
    ];

    public function getClienteAttribute() {
        if ($cliente = Customer::find($this->customer_id)) {
            return $cliente->name;
        }
    }

    public function getEnteAttribute() {
        if ($ente = Customer::find($this->supplier_id)) {
            return $ente->name;
        }
    }

    public function getPagamentoAttribute() {
        if ($pagamento = Payment::find($this->payment_id)) {
            return $pagamento->description;
        }
    }

    public function getResiduoAttribute() {
        $totale_incassato = ScheduleEnte::where('proforma_id', $this->id)
            ->where('status', 3)
            ->sum('amount');

        return $this->totale - $totale_incassato;
    }

    public function getIncassatoAttribute() {
        $totale_incassato = ScheduleEnte::where('proforma_id', $this->id)
            ->where('status', 3)
            ->sum('amount');

        return $totale_incassato;
    }

}
