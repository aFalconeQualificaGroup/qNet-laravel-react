<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PartecipantService extends Model
{
    use HasFactory;

    protected $guarded = [
        'id'
    ];

    public function utente()
    {
        return $this->hasOne(User::class, 'id', 'id_utente');
    }
}
