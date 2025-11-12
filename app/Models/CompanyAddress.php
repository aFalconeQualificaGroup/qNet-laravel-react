<?php

namespace App\Models;

use App\Models\Nations;
use App\Models\Provincies;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class CompanyAddress extends Model
{
    use HasFactory;

    protected $guarded = ['id'];

    public function responsibles() {
        return $this->hasMany(CompanyAddressResponsible::class, 'address_id');
    }

    public function aree() {
        return $this->hasMany(Area::class, 'id_address', 'id');
    }

    public function getProvincecaAttribute() {
        $province = Provincies::find($this->province_id);
        if ($province) {
            $pr = $province->sigla;
        }
        else {
            $pr = '';
        }
        return $pr;
    }

    public function getNazionecaAttribute() {
        $nation = Nations::find($this->nation_id);
        if ($nation) {
            $na = $nation->description;

        }
        else {
            $na = '';
        }
        return $na;
    }

    public function getTipoindirizzoAttribute() {
        switch ($this->type_id) {
            case 1:
                return "Consegna";
                break;
            case 2:
                return "Fatturazione";
                break;
            case 3:
                return "Operativa";
                break;
        }
    }

    public function responsabili() {
        return $this->belongsToMany(User::class, 'responsabile_sites', 'id_site', 'id_utente')->using(ResponsabileSites::class);
    }
}
