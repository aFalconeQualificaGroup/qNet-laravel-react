<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MessaggioContestazione extends Model
{
    use HasFactory;

    protected $fillable = [
        'testo',
        'id_user',
        'id_task',
        'id_company',
    ];

    public function user()
    {
        return $this->hasOne(User::class, 'id', 'id_user');
    }

    public function company()
    {
        return $this->hasOne(Company::class, 'id', 'id_company');
    }

    public function esecuzioneAttivita()
    {
        return $this->hasOne(EsecuzioneAttivita::class, 'id', 'id_task');
    }

}
