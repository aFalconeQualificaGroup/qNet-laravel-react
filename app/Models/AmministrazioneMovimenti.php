<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AmministrazioneMovimenti extends Model
{
    use HasFactory;

    public const TIPO_RADIO = [
        'P' => 'Provvisorio',
        'E' => 'Effettivo'
    ];
    protected $fillable = [
        'id_amministrazione_conti',
        'id_company',
        'tipo',
        'data_incasso',
        'descrizione',
        'note',
        'operazione',
        'scadenza',
        'entrata',
        'uscita'
    ];
}
