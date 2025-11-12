<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Spazio extends Model
{
    use HasFactory;

    protected $fillable = [
        'id_area',
        'nome',
        'spazio_mq'
    ];

    public function area()
    {
        return $this->hasOne(Area::class, 'id', 'id_area');
    }

    public function responsabile()
    {
        return $this->hasOne(User::class, 'id', 'id_user_responsabile');
    }
}
