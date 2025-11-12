<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StationHistory extends Model
{
    use HasFactory;

    protected $table = 'history_station';

    protected $guarded = ['id'];

    public function Station() {
        return $this->belongsTo(Station::class,'id_station','id');
    }

}
