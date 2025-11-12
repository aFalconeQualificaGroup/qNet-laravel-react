<?php

namespace App\Models;

use App\Models\CompanyAddress;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Area extends Model
{
    use HasFactory;

    protected $fillable = [
        'nome',
        'id_address',
    ];

    public function address()
    {
        return $this->hasOne(CompanyAddress::class, 'id', 'id_address');
    }

    public function spazi()
    {
        return $this->hasMany(Spazio::class, 'id_area', 'id');
    }

    public function responsabili()
    {
        return $this->belongsToMany(User::class, 'responsabile_areas', 'id_area', 'id_utente')->using(ResponsabileArea::class);
    }

}
