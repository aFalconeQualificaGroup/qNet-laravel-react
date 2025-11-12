<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BoardTaskMember extends Model
{
    protected $fillable = [
        'task_id',
        'user_id',
    ];

    public $timestamps = false;

    public function task()
    {
        return $this->hasOne(BoardTask::class);
    }

    public function user()
    {
        return $this->hasOne(User::class);
    }
}
