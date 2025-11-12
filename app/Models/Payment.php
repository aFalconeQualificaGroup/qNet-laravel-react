<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    use HasFactory;

    protected $guarded = [
        'id'
    ];

    public function getTypepaymentAttribute() {
        $type = [
            'MP01'  => 'Contanti',
            'MP02'  => 'Assegno',
            'MP03'  => 'Assegno Circolare',
            'MP04'  => 'Contanti Presso Tesoreria',
            'MP05'  => 'Bonifico',
            'MP06'  => 'Vaglia Cambiario',
            'MP07'  => 'Bollettino Bancario',
            'MP08'  => 'Carta di Pagamento',
            'MP09'  => 'RID',
            'MP10'  => 'RID Utenze',
            'MP11'  => 'RID Veloce',
            'MP12'  => 'RIBA',
            'MP13'  => 'MAV',
            'MP14'  => 'Quietanza Erario',
            'MP15'  => 'Giroconto su conti di contabilità speciale',
            'MP16'  => 'Domiciliazione Bancaria',
            'MP17'  => 'Domiciliazione Postale',
            'MP18'  => 'Bollettino di c/c Postale',
            'MP19'  => 'SEPA Direct Debit',
            'MP20'  => 'SEPA Direct Debit CORE',
            'MP21'  => 'SEPA Direct Debit B2B',
            'MP22'  => 'Trattenuta su somme già riscosse',
            'MP23'  => 'PagoPA'
        ];

        return $type[$this->payment_type];

    }

}
