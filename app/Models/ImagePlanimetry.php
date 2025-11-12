<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ImagePlanimetry extends Model
{
    use HasFactory;


    protected $table = 'image';

    protected $fillable = [
        'name','path','created_at','updated_at','deleted'
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

}
