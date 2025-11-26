<?php

namespace App\Observers;

use App\Models\SpazioAttivita;
use App\Models\UserSpazioAttivita;

class SpazioAttivitaObserver
{
    public function deleting(SpazioAttivita $spazioAttivita)
    {
        if ($spazioAttivita->operatori->count()) {
            UserSpazioAttivita::where('spazio_attivita_id', $spazioAttivita->id)->delete();
        }
    }
}
