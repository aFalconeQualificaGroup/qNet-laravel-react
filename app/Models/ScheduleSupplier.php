<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ScheduleSupplier extends Model
{
    protected $guarded = ['id'];

    protected $casts = [
        'expiration_date'  => 'date:d-m-Y',
        'collection_date'  => 'date:d-m-Y',
    ];

    public function getTipopagamentoAttribute() {
        $payment = Payment::find($this->payment_id);
        if ($payment){
            $desc =  $payment->description;
        }
        else {
            $desc =  '';
        }

        return $desc;
    }

    public function getAziendaAttribute() {
        $customer = Customer::find($this->customer_id);
        if ($customer){
            $name =  $customer->name;
        }
        else {
            $name =  '';
        }

        return $name;
    }//
}
