<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ModelloDocumentiOfferta extends Model
{
    use HasFactory;

    protected $table = 'modello_documenti_offerta';

    protected $guarded = [
        'id'
    ];

    public function allegati() {
        return $this->hasMany(ModelloDocumentiOffertaAllegati::class, 'id_modello', 'id');
    }
}
