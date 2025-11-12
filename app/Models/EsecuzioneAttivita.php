<?php

namespace App\Models;

use App\Models\SpazioAttivita;
use App\Observers\EsecuzioneAttivitaObserver;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

#[ObservedBy([EsecuzioneAttivitaObserver::class])]
class EsecuzioneAttivita extends Model
{
    use HasFactory;

    protected $fillable = [
        'id_attivita',
        'data_schedulazione',
        'data_esecuzione',
        'esito',
        'contestata',
        'id_operatore',
    ];

    protected $dates = [
        'data_schedulazione',
        'data_esecuzione',
    ];

    public function spazioAttivita()
    {
        return $this->hasOne(SpazioAttivita::class, 'id', 'id_attivita');
    }



    public function messaggiContestazione()
    {
        return $this->hasMany(MessaggioContestazione::class, 'id_task', 'id');
    }

    public function operatori()
    {
        return $this->belongsToMany(User::class)->using(UserEsecuzioneAttivita::class)
            ->withPivot('id');
    }
}
