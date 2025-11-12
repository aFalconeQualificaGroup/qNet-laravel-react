<?php

namespace App\Models;

use App\Models\Criterio;
use App\Models\SchedaVerifica;
use App\Models\Sottospazio;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SchedaVerificaCriteri extends Model
{
    use HasFactory;

    protected $fillable = [
        'id_scheda_verifica',
        'id_criterio',
        'id_sottospazio',
        'conforme',
    ];

    public function schedaVerifica()
    {
        return $this->hasOne(SchedaVerifica::class, 'id', 'id_scheda_verifica');
    }

    public function criterio()
    {
        return $this->hasOne(Criterio::class, 'id', 'id_criterio');
    }

    public function sottospazio()
    {
        return $this->hasOne(Sottospazio::class, 'id', 'id_sottospazio');
    }
}
