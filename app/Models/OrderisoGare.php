<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrderisoGare extends Model
{
    use HasFactory;

    protected $guarded = [
        'id'
    ];

    public function getCompanyAttribute() {
        $customer = Company::find($this->company_id);
        $name = !empty($customer) ? $customer->name  : '';
        return $name;
    }

    public function getCommercialenameAttribute() {
        $contact = Contact::find($this->commerciale);
        $name = !empty($contact) ? $contact->last_name . ' ' . $contact->name  : '';
        return $name;
    }

    public function getSegnalatorenameAttribute() {
        $contact = Contact::find($this->segnalatore);
        $name = !empty($contact) ? $contact->last_name . ' ' . $contact->name  : '';
        return $name;
    }

    public function getStatoConsulenzaNameAttribute() {
        $statoConsulenza = '';
        if ($this->stato_consulenza != null || $this->stato_consulenza != '') {
            $getStatoConsulenza = Progress::find($this->stato_consulenza);
            if ($getStatoConsulenza) {
                $statoConsulenza = $getStatoConsulenza->description;
            }
        }
        return $statoConsulenza;
    }
}
