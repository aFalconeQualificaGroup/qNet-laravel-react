<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SharedDocument extends Model {

    use HasFactory;

    protected $guarded = [
        'id'
    ];

    public function getCaricatoAttribute() {
        if ($this->user_id) {
            if ($user = User::find($this->user_id)) {
                return $user->last_name . ' ' . $user->name;
            }
        }
    }
}
