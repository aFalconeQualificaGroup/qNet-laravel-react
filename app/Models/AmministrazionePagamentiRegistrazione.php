<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AmministrazionePagamentiRegistrazione extends Model
{
    use HasFactory;

    protected $fillable = [
        'pagamenti_id',
        'company_id',
        'datareg',
        'datascadenza',
        'descrizione',
        'importo',
        'nome_allegato',
        'contenuto_allegato',
        'stato'
    ];
}
