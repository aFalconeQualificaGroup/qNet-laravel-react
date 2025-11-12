<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AmministrazioneIncassiRegistrazioneNote extends Model
{
    use HasFactory;

    protected $fillable = [
        'incassi_id',
        'registrazione_id',
        'note',
        'nome_allegato',
        'hnome_allegato',
        'contenuto_allegato',
        'stato'
    ];
}
