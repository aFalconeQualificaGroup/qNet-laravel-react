<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Inventory_product extends Model {

    use HasFactory;

    protected $guarded = [
        'id'
    ];

    public function getTypedocumentAttribute() {
        switch ($this->document_type) {
            case 1:
                return "DDT Carico";
                break;
            case 2:
                return "Fattura di Carico";
                break;
            case 3:
                return "Scontrino di Carico";
                break;
            case 4:
                return "DDT Scarico";
                break;
            case 5:
                return "Fattura di Scarico";
                break;
            case 6:
                return "Scontrino di Scarico";
                break;
            case 7:
                return "Allinea Carico";
                break;
            case 8:
                return "Allinea Scarico";
                break;
            case 9:
                return "Ordine Acquisto";
        }
    }

}
