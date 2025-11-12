<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AmministrazionePagamentiRegistrazioneNoteEffettive extends Model
{
    use HasFactory;

    protected $fillable = [
        'datareg',
        'registrazione_id',
        'tipo',
        'conto_id',
        'note',
        'nome_allegato',
        'hnome_allegato',
        'contenuto_allegato',
        'ext_allegato',
        'stato'
    ];
}
