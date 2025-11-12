<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProformforaHead extends Model
{
    use HasFactory;

    protected $guarded = ['id'];

    protected $casts = [
        'date_proforma'  => 'date:d-m-Y',
        'date_riferimento' => 'date:d-m-Y',
    ];

}
