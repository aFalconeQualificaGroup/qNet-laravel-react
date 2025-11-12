<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PlanimetryStationPoint extends Model
{
    use HasFactory;

    protected $table = 'planimetry_station_point';

    protected $fillable = [
        'planimetry_id',
        'station_id',
        'position_x',
        'position_y',
    ];


    // public function Planimetry() {
    //     return $this->belongsTo(Planimetry::class, 'id_planimetry','id');
    // }

    // public function Station() {
    //     return $this->belongsTo(Station::class, 'id_station','id');
    // }

    public function planimetry()
    {
        return $this->hasOne(Planimetry::class, 'id', 'planimetry_id');
    }

    public function station()
    {
        return $this->hasOne(Station::class, 'id', 'station_id');
    }

}
