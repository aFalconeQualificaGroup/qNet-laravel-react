<?php

namespace App\Models;

use App\Models\Sottospazio;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Criterio extends Model
{
    use HasFactory;

    protected $fillable = [
        'id_sottospazio',
        'nome',
    ];

    public function sottospazio()
    {
        return $this->hasOne(Sottospazio::class, 'id', 'id_sottospazio');
    }
}
