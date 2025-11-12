<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AmministrazionePagamenti extends Model
{
    use HasFactory;

    protected $fillable = [
        'datareg',
        'tipo',
        'conto_id',
        'tipologia',
        'stato'
    ];

    public function pagamentiregistrazione()
    {
        return $this->hasMany(AmministrazionePagamentiRegistrazione::class, 'pagamenti_id', 'id');
    }

    public function pagamentiregistrazionemovimenti()
    {
        return $this->hasMany(AmministrazionePagamentiRegistrazioneMovimenti::class, 'pagamenti_id', 'id');
    }

    public function pagamentiregistrazionenote()
    {
        return $this->hasMany(AmministrazionePagamentiRegistrazioneNote::class, 'pagamenti_id', 'id');
    }
}
