<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RequestIsoAddress extends Model
{
    use HasFactory;

    protected $connection = "preventivi";

    protected $guarded = [
        'id'
    ];

    public function getProvinciaAttribute() {
        $province = Provincies::find($this->province_id);
        if ($province) {
            return ' (' . $province->sigla . ' )';
        }
    }

    public function getSedeAttribute() {
        $descrizione = '';
        if ($this->sede_id == 1) {
            $descrizione = 'Consegna';
        }
        elseif($this->sede_id == 2) {
            $descrizione = 'Fatturazione';
        }
        elseif($this->sede_id == 3) {
            $descrizione = 'Sede Operativa';
        }

        return $descrizione;
    }

}
