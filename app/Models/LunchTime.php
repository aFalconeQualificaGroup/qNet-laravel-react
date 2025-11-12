<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LunchTime extends Model
{
    use HasFactory;

    protected static $unguarded = true;
    protected $table = 'lunch_time';

    protected $casts = [
        'from_time' => 'datetime:H:i',
        'to_time' => 'datetime:H:i',
    ];
}
