<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;


// Note Spese
class ExpenseReport extends Model {
    use HasFactory;

    protected $guarded = [
        'id'
    ];

    public function getShortrateAttribute() {

        $rate = Rate::find($this->rate_id);
        if ($rate){
            $shortdesc =  $rate->shortdesc;
        }else {
            $shortdesc =  '';
        }

        return $shortdesc;
    }
}
