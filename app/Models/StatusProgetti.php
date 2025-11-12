<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StatusProgetti extends Model
{
    use HasFactory;

    protected $table = 'status_progetti';

    protected $guarded = [
        'id'
    ];
}
