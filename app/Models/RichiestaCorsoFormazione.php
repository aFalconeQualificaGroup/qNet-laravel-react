<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RichiestaCorsoFormazione extends Model
{
    use HasFactory;

    protected $guarded = ['id'];

    public function operatore()
    {
        return $this->hasOne(User::class, 'id', 'id_operatore');
    }

    public function stato()
    {
        return $this->hasOne(StatusRichiestaCorsoFormazione::class, 'id', 'id_stato');
    }
}
