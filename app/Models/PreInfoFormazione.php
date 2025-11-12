<?php

namespace App\Models;

use App\Observers\PreInfoFormazioneObserver;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

#[ObservedBy([PreInfoFormazioneObserver::class])]
class PreInfoFormazione extends Model
{
    use HasFactory;

    protected $guarded = [
        'id'
    ];

    public function opportunity()
    {
        return $this->belongsTo(Opportunity::class);
    }

    public function operatoreUser()
    {
        return $this->hasOne(User::class, 'id', 'id_operatore');
    }

    public function stato()
    {
        return $this->hasOne(StatusRichiestaCorsoFormazione::class, 'id', 'id_stato');
    }
}
