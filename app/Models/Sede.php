<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Sede extends Model
{
    use HasFactory;

    protected $table = 'sedi';
    protected $guarded = ['id'];

    protected $appends = [
        'nome',
    ];

    public function getNomeAttribute() {
        return $this->nome_agenzia_formativa . ' - ' . $this->indirizzo_sede . ' - ' . $this->comune_sede;
    }
}
