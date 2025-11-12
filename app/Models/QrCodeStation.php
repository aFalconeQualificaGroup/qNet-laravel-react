<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class QrCodeStation extends Model
{
    use HasFactory;

    protected $table = 'station_qrcode';

    protected $fillable = [
        'text','id_station','updated_at','deleted'
    ];

    public function Station() {
        return $this->belongsTo(Station::class, 'id_station','id');
    }
}
