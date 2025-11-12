<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AmministrazioneIncassiRegistrazione extends Model
{
    use HasFactory;

    protected $fillable = [
        'incassi_id',
        'company_id',
        'datareg',
        'datascadenza',
        'descrizione',
        'importo',
        'nome_allegato',
        'contenuto_allegato',
        'stato'
    ];

    public function getAziendaAttribute() {
        $nome = '';
        $azienda = Company::find($this->company_id);
        if ($azienda) {
            $nome = $azienda->name;
        }
        return $nome;
    }
}
