<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ModelloDocumentiAllegati extends Model
{
    use HasFactory;

    protected $table = 'modello_documenti_allegati';

    protected $guarded = [
        'id'
    ];
}
