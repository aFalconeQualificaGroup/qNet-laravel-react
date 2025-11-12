<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EmailQuotationReminder extends Model
{
    use HasFactory;

    protected $guarded = [
        'id'
    ];

    public function emailQuotation() {
        return $this->hasOne(EmailQuotation::class, 'id', 'email_quotation_id');
    }
}
