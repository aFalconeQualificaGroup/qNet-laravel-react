<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\Pivot;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ResponsabileSites extends Pivot {
    use HasFactory;

    protected $table = 'responsabile_sites';

    protected $guarded = [
        'id'
    ];
}
