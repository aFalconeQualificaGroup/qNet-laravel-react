<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ScheduleEnte extends Model
{
    protected $table = "schedule_ente";

    protected $guarded = ['id'];

    protected $casts = [
        'expiration_date'  => 'date:d-m-Y',
        'collection_date'  => 'date:d-m-Y',
    ];

    public function getTipoPagamentoAttribute() {
        if ($pagamento = Payment::find($this->payment_id)) {
            return $pagamento->description;
        }
    }
}
