<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AmministrazioneIncassiProforma extends Model
{
    use HasFactory;

    protected $fillable = [
        'proforma_id',
        'progressive',
        'date_proforma',
        'quotation_id',
        'order_id',
        'customer_id',
        'bank_id',
        'payment_id',
        'imponibile',
        'iva',
        'totale',
        'note',
        'stato'
    ];
}
