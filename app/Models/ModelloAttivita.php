<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ModelloAttivita extends Model
{
    use HasFactory;

    protected $fillable = [
        'nome',
        'descrizione',
    ];

    public function attivitas()
    {
        return $this->belongsToMany(Attivita::class)->using(ModelloAttivitaPivot::class)
            ->withPivot('id');
    }
}
