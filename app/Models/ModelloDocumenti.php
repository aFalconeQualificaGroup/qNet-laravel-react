<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ModelloDocumenti extends Model
{
    use HasFactory;

    use HasFactory;

    protected $table = 'modello_documenti';

    protected $guarded = [
        'id'
    ];

    public function allegati() {
        return $this->hasMany(ModelloDocumentiAllegati::class, 'id_modello', 'id');
    }
}
