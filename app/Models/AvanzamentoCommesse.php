<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AvanzamentoCommesse extends Model
{
    use HasFactory;

    protected $table = 'avanzamento_commesse';

    protected $guarded = ['id'];

    protected $casts = [
        'data'     => 'date:d-m-Y',
    ];

}
