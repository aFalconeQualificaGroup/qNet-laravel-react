<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GruppiDiLavoro extends Model
{
    use HasFactory;

    protected $table = 'gruppi_di_lavoro';
    protected $guarded = [
        'id'
    ];

}
