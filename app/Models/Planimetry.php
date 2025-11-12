<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Planimetry extends Model
{
    use HasFactory;

    protected $table = 'planimetry';

    protected $fillable = [
        'id_site',
        'id_image',
        'image',
        'deleted',
        'lock',
    ];

    public static function getAllWithoutDelete() {
        $items = self::where('deleted','!=', 1)->get();
        return $items;
    }

    public static function deleting($id) {
        $istance = self::find($id);
        $istance->deleted = 1;
        $istance->save();
    }

    public function Image() {
        return $this->hasOne(ImagePlanimetry::class, 'id', 'id_image');
    }

    public function Stations() {
        return $this->hasMany(Station::class, 'planimetry_id', 'id');
    }

    public function Points() {
        return $this->hasMany(PlanimetryStationPoint::class,'planimetry_id','id');
    }

    public function getEquipmentAttribute() {
        $equipment = StationEquipment::find($this->station_equipment_id);
        if ($equipment) {
            return $equipment->name;
        }
        return '';
    }

}
