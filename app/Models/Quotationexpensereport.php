<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Quotationexpensereport extends Model {
    use HasFactory;

    protected $guarded = [
        'id'
    ];

    protected $casts = [
        'proforma_data'  => 'date:d-m-Y',
    ];

    public function quotation() {
    	return $this->belongsTo(Quotation::class);
    }
}
