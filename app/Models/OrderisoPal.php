<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrderisoPal extends Model
{
    use HasFactory;

    protected $guarded = [
        'id'
    ];

    protected $casts = [
        'data_avv_procedure'  => 'date:d-m-Y',
        'data_incontro_utente'  => 'date:d-m-Y',
        'data_avv_misura' => 'date:d-m-Y',
    ];
}
