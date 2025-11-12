<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StationEquipment extends Model
{
    use HasFactory;

    protected $table = 'station_equipment';

    protected $guarded = [
        'id'
    ];

    public static function getAllWithoutDelete() {
        $items = self::where('deleted','!=', 1)->get();
        return $items;
    }

    public static function deleting($id){
        $istance = self::find($id);
        $istance->deleted = 1;
        $istance->save();
    }

    public function getWeed1Attribute() {
        $weed = '';
        if ($this->weed_type1 != '') {
            $weed1 = Weed::find($this->weed_type1);
            if ($weed1) {
                $weed = $weed1->description;
            }
        }
        return $weed;
    }

    public function getWeed2Attribute() {
        $weed = '';
        if ($this->weed_type2 != '') {
            $weed2 = Weed::find($this->weed_type2);
            if ($weed2) {
                $weed = $weed2->description;
            }
        }
        return $weed;
    }

    public function getWeed3Attribute() {
        $weed = '';
        if ($this->weed_type3 != '') {
            $weed3 = Weed::find($this->weed_type3);
            if ($weed3) {
                $weed = $weed3->description;
            }
        }
        return $weed;
    }
}
