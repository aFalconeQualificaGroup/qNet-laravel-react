<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\Pivot;

class ResponsabileArea extends Pivot {
    use HasFactory;

    protected $table = 'responsabile_areas';

    protected $guarded = [
        'id'
    ];

}
