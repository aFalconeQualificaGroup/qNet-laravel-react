<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AmministrazioneConti extends Model
{
    use HasFactory;
    protected $fillable = [
        'name',
        'iban',
        'cc',
        'address',
        'zip',
        'city',
        'province_id',
        'note',
        'circuit',
        'card_holder',
        'card_number',
        'card_expiry',
        'card_ccv',
        'card_password',
        'type',
        'type_card',
        'conto_id'
    ];
    const CIRCUIT_LIST = [
        'visa' => 'Visa',
        'mastercard' => 'Mastercard',
        'amex' => 'Amex'
    ];
}
