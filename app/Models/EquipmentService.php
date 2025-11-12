<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EquipmentService extends Model {

    use HasFactory;

    protected $guarded = [
        'id'
    ];

    protected $casts = [
        'date_service' => 'date:d-m-Y',
        'expiration'   => 'date:d-m-Y',
    ];

    public function attrezzatura() {
        return $this->belongsTo(Equipment::class);
    }

    public function getTipoInterventoAttribute() {
        if ($this->type === 1) {
            return 'Ordinario';
        }
        return 'Straordinario';
    }

    public function getEsitoInterventoAttribute() {
        if ($this->esito === 1) {
            return 'Positivo';
        }
        return 'Negativo';
    }

}
