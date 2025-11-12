<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PreInfoIstruzione extends Model
{
    use HasFactory;

    protected $table = 'pre_info_istruzione';

    protected $casts = [
        'ist_data'              => 'date:d-m-Y',
        'ist_inizio_presunto'   => 'date:d-m-Y',
        'ist_inizio_effettivo'  => 'date:d-m-Y',
        'ist_fine_presunta'     => 'date:d-m-Y',
        'ist_fine_effettiva'    => 'date:d-m-Y',
    ];

    protected $guarded = [
        'id'
    ];
}
