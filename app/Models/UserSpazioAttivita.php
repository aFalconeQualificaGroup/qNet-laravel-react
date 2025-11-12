<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\Pivot;

class UserSpazioAttivita extends Pivot
{
    use HasFactory;

    protected $table = 'spazio_attivita_user';

    protected $fillable = [
        'spazio_attivita_id',
        'user_id',
    ];

    public $timestamps = false;

    public function spazioAttivita()
    {
        return $this->hasOne(SpazioAttivita::class, 'id', 'spazio_attivita_id');
    }
}
