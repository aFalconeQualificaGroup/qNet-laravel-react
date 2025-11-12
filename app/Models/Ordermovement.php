<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Ordermovement extends Model {
    use HasFactory;

    protected $casts = [
        'date_movement' => 'date:d-m-Y',
    ];

    protected $guarded = [
        'id'
    ];
}
