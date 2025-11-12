<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\Pivot;

class ModelloAttivitaPivot extends Pivot
{
    use HasFactory;

    protected $table = 'attivita_modello_attivita';

    protected $fillable = [
        'modello_attivita_id',
        'attivita_id',
    ];

    public $timestamps = false;

    public function attivita()
    {
        return $this->hasOne(Attivita::class, 'id', 'attivita_id');
    }
}
