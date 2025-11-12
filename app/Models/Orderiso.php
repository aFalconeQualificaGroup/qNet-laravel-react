<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Orderiso extends Model {

    use HasFactory;

    protected $guarded = [
        'id'
    ];

    protected $casts = [
        'created_at' => 'date:d-m-Y',
        'data_scadenza_certificato' => 'date:d-m-Y',
        'data_ente_primo_audit' => 'date:d-m-Y',
        'data_ente_ultimo_audit' => 'date:d-m-Y',
        'data_ente_prossimo_audit' => 'date:d-m-Y',
        'data_intervista' => 'date:d-m-Y',
        'data_vi' => 'date:d-m-Y',
        'data_emissione_certificato' => 'date:d-m-Y',
        'data_inizio_lavorazione' => 'date:d-m-Y',
        'data_fine_lavorazione' => 'date:d-m-Y',
        'data_ultima_chiamata' => 'date:d-m-Y',
        'data_richiamo' => 'date:d-m-Y',
        'data_ultimo_audit' => 'date:d-m-Y',
        'soa_ultima_chiamata' => 'date:d-m-Y',
        'soa_richiamo' => 'date:d-m-Y',
        'soa_inizio_lavorazione' => 'date:d-m-Y',
        'soa_fine_lavorazione' => 'date:d-m-Y',
        'soa_emissioni' => 'date:d-m-Y',
        'soa_verifica_triennale' => 'date:d-m-Y',
        'soa_scadenza' => 'date:d-m-Y',
        'soa_ente_certificazione_scadenza' => 'date:d-m-Y',
        'gdpr_inizio_lavorazione' => 'date:d-m-Y',
        'gdpr_fine_lavorazione' => 'date:d-m-Y',
        'gdpr_ultima_chiamata' => 'date:d-m-Y',
        'gdpr_richiamo' => 'date:d-m-Y',
        'gdpr_prossima_consulenza' => 'date:d-m-Y',
        'res_inizio_lavorazione' => 'date:d-m-Y',
        'res_fine_lavorazione' => 'date:d-m-Y',
        'res_ultima_chiamata' => 'date:d-m-Y',
        'res_richiamo' => 'date:d-m-Y',
        'soa_data_firma' => 'date:d-m-Y',
        'data_verifica_ufficiale' => 'date:d-m-Y',
    ];
}
