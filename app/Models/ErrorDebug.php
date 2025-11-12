<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ErrorDebug extends Model {

    protected $connection= 'landlord';

    use HasFactory;

    protected $guarded = [
        'id'
    ];
}
