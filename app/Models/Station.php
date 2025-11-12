<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Station extends Model
{
    use HasFactory;

    protected $table = 'station';

    protected $guarded = [
        'id'
    ];

    public static function getAllWithoutDelete() {
        $items = self::where('deleted', '!=', 1)->get();
        return $items;
    }

    public static function deleting($id){
        $istance = self::find($id);
        $istance->deleted = 1;
        $istance->save();
    }

    public function Equipment() {
        return $this->belongsTo(StationEquipment::class, 'station_equipment_id', 'id');
    }

    public function History() {
        return $this->hasMany(StationHistory::class, 'id_station', 'id');
    }

    public function QrCode() {
        return $this->hasOne(QrCodeStation::class, 'id_station', 'id');
    }

    public function Documents() {
        return $this->hasMany(StationDocument::class,'id_station','id');
    }

    public function planimetry()
    {
        return $this->hasOne(Planimetry::class, 'id', 'planimetry_id');
    }

    public function station_equipment()
    {
        return $this->hasOne(StationEquipment::class, 'id', 'station_equipment_id');
    }

}
