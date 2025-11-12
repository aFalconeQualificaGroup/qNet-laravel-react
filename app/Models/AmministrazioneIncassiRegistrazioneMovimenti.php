<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AmministrazioneIncassiRegistrazioneMovimenti extends Model
{
    use HasFactory;

    protected $fillable = [
        'incassi_id',
        'air_id',
        'company_id',
        'proforma_id',
        'importo',
        'importo_residuo',
        'residuo',
        'stato'
    ];

    public function cliente()
    {
        return $this->hasMany(Company::class, 'company_id', 'id');
    }

}
