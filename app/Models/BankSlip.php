<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BankSlip extends Model
{
    use HasFactory;

    protected $table = 'bank_slip';
    protected $guarded = ['id'];

    protected $casts = [
        'data_distinta'     => 'date:d-m-Y',
    ];

    public function bankslipdatails() {
    	return $this->hasMany(AmministrazioneIncassiRegistrazione::class, 'distinta_id', 'id');
    }

    public function getDescrizioneContoAttribute() {
        $descrizione = '';
        $conto = AmministrazioneConti::find($this->conto);
        if ($conto) {
            $descrizione = $conto->name;
        }
        return $descrizione;
    }

    public function getDescrizioneStatoAttribute() {
        $stati =   [0 => 'Aperta', 1 => 'Chiusa', 2 => 'Insoluta'];

        return $stati[$this->stato];
    }

}
