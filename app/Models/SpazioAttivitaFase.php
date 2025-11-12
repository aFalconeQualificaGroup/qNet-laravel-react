<?php

namespace App\Models;

use App\Models\SpazioAttivita;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class SpazioAttivitaFase extends Model {
    use HasFactory;

    protected $fillable = [
        'quotation_id',
        'service_quotation_id',
        'spazio_id',
        'area_id',
        'site_id',
        'title',
        'position'
    ];

    public function elencoattivita() {
        return $this->hasMany(SpazioAttivita::class, 'spazio_attivita_fase', 'id');
    }
}
