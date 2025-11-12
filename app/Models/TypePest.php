<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TypePest extends Model
{
    use HasFactory;

    protected $table = 'type_pest';

    protected $fillable = [
        'name', 'code', 'deleted'
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

    public $timestamps = false;

}
