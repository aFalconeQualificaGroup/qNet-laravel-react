<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RequestSicurezza extends Model
{
    use HasFactory;

    protected $connection = "preventivi";

    protected $guarded = [
        'id'
    ];

    public function getProvinciaAttribute() {
        $province = Provincies::find($this->company_province);
        if ($province) {
            return ' (' . $province->sigla . ' )';
        }
    }

    public function getUtenteAttribute() {
        $utente = User::find($this->verified_user);
        if ($utente) {
            return $utente->name . ' ' . $utente->last_name;
        }
    }

    public function getSiglaUtenteAttribute() {
        $utente = User::find($this->verified_user);
        if ($utente) {
            return $utente->name[0] . $utente->last_name[0];
        }
    }
}
