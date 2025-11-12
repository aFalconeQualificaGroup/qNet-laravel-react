<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SiteAviability extends Model
{
    use HasFactory;

    protected $table = 'site_aviability';

    protected $fillable = [
        'id_site','id_site_day','hour'
    ];

    public $timestamps = false;

    public static function checkEqualsSiteAviability($idSite, $idDay){
        $result = self::where('id_site','=', $idSite)->where('id_site_day','=', $idDay)->first();
        if ($result != null){
            return true;
        }
        return false;
    }

    public static function deleteAllFromSite($idSite){
        $result = self::where('id_site','=', $idSite)->delete();

    }

}
