<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AmministrazioneIncassi extends Model
{
    use HasFactory;

    protected $fillable = [
        'datareg',
        'tipo',
        'proforma_id',
        'invoice_id',
        'conto_id',
        'tipologia',
        'stato'
    ];

    public function incassiregistrazione()
    {
        return $this->hasMany(AmministrazioneIncassiRegistrazione::class, 'incassi_id', 'id');
    }

    public function incassiregistrazionemovimenti()
    {
        return $this->hasMany(AmministrazioneIncassiRegistrazioneMovimenti::class, 'incassi_id', 'id');
    }

    public function incassiregistrazionenote()
    {
        return $this->hasMany(AmministrazioneIncassiRegistrazioneNote::class, 'incassi_id', 'id');
    }
}
