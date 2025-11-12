<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Comunication extends Model
{
    use HasFactory;

    protected $casts = [
        'date_comunication' => 'date:d-m-Y',
    ];

    protected $guarded = ['id'];

    public function TipoInvio() {
        $tipo = '';
        if ($this->type_comunication==1) {
            $tipo = 'Tutti i clienti';
        }
        elseif ($this->type_comunication == 2) {
            $tipo = 'Selezione per Clienti';

        }
        elseif ($this->type_comunication == 3) {
            $tipo = 'Settore Attività';
        }
        return $tipo;
    }
}
