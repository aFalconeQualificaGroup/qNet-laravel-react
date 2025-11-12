<?php

namespace App\Models;

use App\Models\Attivita;
use App\Models\Spazio;
use App\Observers\SpazioAttivitaObserver;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

#[ObservedBy([SpazioAttivitaObserver::class])]
class SpazioAttivita extends Model
{
    use HasFactory;

    protected $guarded = [
        'id'
    ];

    public function attivita() {
        return $this->hasOne(Attivita::class, 'id', 'id_attivita');
    }

    public function spazio() {
        return $this->hasOne(Spazio::class, 'id', 'id_spazio');
    }

    public function operatori() {
        return $this->belongsToMany(User::class)->using(UserSpazioAttivita::class)
            ->withPivot('id');
    }

    public function spaziodocumenti() {
        return $this->hasMany(SpazioAttivitaDocument::class);
    }

    public function subattivita() {
        return $this->hasMany(SpazioAttivita::class, 'parent_id', 'id_attivita');
    }

    public function quotationservice() {
        return $this->hasOne(Quotationservice::class, 'id', 'quotation_service');
    }

}
