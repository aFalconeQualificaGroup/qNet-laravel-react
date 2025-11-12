<?php

namespace App\Models;

use App\Models\Attivita;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Sottospazio extends Model
{
    use HasFactory;

    protected $fillable = [
        'id_attivita',
        'nome',
    ];

    public function attivita()
    {
        return $this->hasOne(Attivita::class, 'id', 'id_attivita');
    }

    public function criteri()
    {
        return $this->hasMany(Criterio::class, 'id_sottospazio', 'id');
    }
}
