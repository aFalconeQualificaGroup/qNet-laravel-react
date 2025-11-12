<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Commission extends Model
{
    use HasFactory;

    protected $guarded = ['id'];

    public function getTipologianameAttribute()
    {
        $tipologia = '';
        if ($this->type_commission==1) {
            $tipologia = 'Commerciale';
        }elseif($this->type_commission==2) {
            $tipologia = 'Segnalatore';
        }elseif($this->type_commission==3) {
            $tipologia = 'Supervisore';
        }
        return $tipologia;
    }

    public function getTotalPaymentAttribute() {

        $total = 0;
        $total = CommissionPayment::where('commission_id',$this->id)->sum('document_total');
        return $total;
    }

    public function commissionpayment() {
        return $this->hasMany(CommissionPayment::class);
    }
}
