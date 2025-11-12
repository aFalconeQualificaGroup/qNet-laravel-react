<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PreInfoProgettiRuoli extends Model
{
    use HasFactory;

    protected $table = 'pre_info_progetti_ruoli';

    protected $guarded = [
        'id'
    ];

    public function getUtenteAttribute() {
        $utente = '';
        $user = User::find($this->utente_id);
        if ($user) {
            $utente = $user->last_name . ' ' . $user->name;
        }
        return $utente;
    }

}
