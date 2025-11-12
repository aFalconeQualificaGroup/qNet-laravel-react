<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BoardTaskLabel extends Model
{
    use HasFactory;

    protected $fillable = [
        'task_id',
        'board_id',
    ];

    public $timestamps = false;
}
