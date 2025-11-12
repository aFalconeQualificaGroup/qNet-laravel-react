<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LeadVisita extends Model
{
    use HasFactory;

    protected $casts = [
        'data_esecuzione_visita'  => 'date:d-m-Y',
    ];

    protected $guarded = ['id'];

}
