<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ModelloDocumentiClienti extends Model
{
    use HasFactory;

    protected $table = 'modello_documenti_clienti';

    protected $guarded = [
        'id'
    ];
}
