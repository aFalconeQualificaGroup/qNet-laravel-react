<?php

namespace App\Models;

use App\Observers\RawLeadObserver;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

#[ObservedBy([RawLeadObserver::class])]
class RawLead extends Model
{
    use HasFactory;

    protected $guarded = [
        'id'
    ];

    protected $casts = [
        'import_date' => 'date:d-m-Y',
        'data_richiamo' => 'date:d-m-Y',
    ];

    public function getUtenteAttribute() {
        if ($utente = $this->userAssigned) {
            return $utente->name . ' ' . $utente->last_name;
        }

        return '';
    }

    public function getSiglaUtenteAttribute() {
        if ($utente = $this->userAssigned) {
            return $utente->name[0] . $utente->last_name[0];
        }

        return '';
    }

    public function userAssigned() {
        return $this->hasOne(User::class, 'id', 'assigned');
    }

    public function source() {
        return $this->hasOne(Source::class, 'id', 'fonte');
    }
}
