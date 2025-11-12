<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TaskObserver extends Model
{
    protected $table = 'task_observers';

    protected $guarded = [
        'id'
    ];

    public function task()
    {
        return $this->belongsTo(Task::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}