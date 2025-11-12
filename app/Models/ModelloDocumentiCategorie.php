<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ModelloDocumentiCategorie extends Model
{
    use HasFactory;

    protected $table = 'modello_documenti_categorie';

    protected $guarded = [
        'id'
    ];

    public function modellodocumentocategorie() {
    	return $this->hasMany(ModelloDocumentiClientiRighe::class, 'category_id', 'id')->orderBy('category_id')->orderBy('position');
    }
}
