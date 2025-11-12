<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\Pivot;

class UserEsecuzioneAttivita extends Pivot
{
    use HasFactory;

    protected $table = 'esecuzione_attivita_user';

    protected $fillable = [
        'esecuzione_attivita_id',
        'user_id',
    ];

    public $timestamps = false;

    public function esecuzioneAttivita()
    {
        return $this->hasOne(EsecuzioneAttivita::class, 'id', 'esecuzione_attivita_id');
    }
}
