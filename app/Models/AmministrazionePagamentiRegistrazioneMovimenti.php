<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AmministrazionePagamentiRegistrazioneMovimenti extends Model
{
    use HasFactory;

    protected $fillable = [
        'pagamenti_id',
        'apr_id',
        'company_id',
        'proforma_id',
        'importo',
        'importo_residuo',
        'residuo',
        'stato'
    ];

    public function fornitore()
    {
        return $this->hasMany(Company::class, 'company_id', 'id');
    }
}
