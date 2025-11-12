<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ModelloDocumentiOffertaAllegati extends Model
{
    use HasFactory;

    protected $table = 'modello_documenti_offerta_allegati';

    protected $guarded = [
        'id'
    ];
}
