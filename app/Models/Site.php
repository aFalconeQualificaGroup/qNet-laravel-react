<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Site extends Model
{
    use HasFactory;

    protected $table = 'site';

    protected $guarded = [
        'id'
    ];

    public function aree() {
        return $this->hasMany(Area::class, 'id_address', 'id');
    }

    public static function getAllWithoutDelete() {
        $items = self::where('deleted','!=', 1)->get();
        return $items;
    }

    public static function deleting($id) {
        $istance = self::find($id);
        $istance->deleted = 1;
        $istance->save();
    }

    public function SiteAviability() {
        return $this->hasMany(SiteAviability::class, 'id_site', 'id');
    }

    public function Planimetry() {
        return $this->hasMany(Planimetry::class, 'id_site', 'id');
    }

    public function responsabili()
    {
        return $this->belongsToMany(User::class, 'responsabile_sites', 'id_site', 'id_utente')->using(ResponsabileSites::class);
    }

}
