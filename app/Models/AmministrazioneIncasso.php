<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AmministrazioneIncasso extends Model
{
    use HasFactory;

    public const TIPO_PAGAMENTO = [
        'Contante',
        'Assegno',
        'Bonifico',
        'Ri.Ba.',
        'Cambiale',
       // 'Bonifico immediato'
    ];
}
