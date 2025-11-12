<?php

namespace App\Models;

use App\Models\EsecuzioneAttivita;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SchedaVerifica extends Model
{
    use HasFactory;

    protected $fillable = [
        'id_task',
        'data_verifica',
        'allegato',
        'note',
    ];

    public function esecuzioneAttivita()
    {
        return $this->hasOne(EsecuzioneAttivita::class, 'id', 'id_task');
    }

    public function criteri()
    {
        return $this->hasMany(SchedaVerificaCriteri::class, 'id_scheda_verifica', 'id');
    }
}
