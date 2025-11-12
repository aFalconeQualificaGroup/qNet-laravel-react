<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Opportunityfase extends Model {

    use HasFactory;

    protected $guarded = [
        'id'
    ];

    protected $casts = [
        'fase_data' => 'date:d-m-Y',
    ];

    public function opportunity() {
        return $this->belongsTo(Opportunity::class);
    }
}
