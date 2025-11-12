<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TaskAssigned extends Model
{
    use HasFactory;

    protected $guarded = [
        'id'
    ];

    /**
     * Get the task that owns the assigned.
     */
    public function assigned() {
        return $this->belongsTo(Task::class);
    }

    public function getUserTaskAttribute() {
        if ($user = $this->user) {
            return  $user->name . ' ' . $user->last_name;
        }

        return ' ';
    }

    public function user() {
        return $this->belongsTo(User::class);
    }
}
