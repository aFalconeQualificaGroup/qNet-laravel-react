<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TaskSub extends Model {
    use HasFactory;

    protected $guarded = [
        'id'
    ];


    public function subtask()     {
        return $this->belongsTo(Task::class);
    }

}
