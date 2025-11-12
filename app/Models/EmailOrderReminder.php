<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EmailOrderReminder extends Model
{
    use HasFactory;

    protected $guarded = [
        'id'
    ];

    public function emailOrder() {
        return $this->hasOne(EmailOrder::class, 'id', 'email_order_id');
    }
}
