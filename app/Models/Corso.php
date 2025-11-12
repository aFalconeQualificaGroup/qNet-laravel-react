<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Corso extends Model
{
    use HasFactory;

    protected $table = 'corsi';
    protected $guarded = ['id'];

    public function sede()
    {
        return $this->hasOne(Sede::class, 'id', 'id_sede');
    }
}
