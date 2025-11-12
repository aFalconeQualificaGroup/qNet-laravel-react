<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\Pivot;

class ResponsabileService extends Pivot {
    use HasFactory;

    protected $table = 'responsabile_services';

    protected $guarded = [
        'id'
    ];

    public function utente()
    {
        return $this->hasOne(User::class, 'id', 'id_utente');
    }
}
