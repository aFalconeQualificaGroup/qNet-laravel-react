<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EmailOpportunityReminder extends Model
{
    use HasFactory;

    protected $guarded = [
        'id'
    ];

    public function emailOpportunity() {
        return $this->hasOne(EmailOpportunity::class, 'id', 'email_opportunity_id');
    }
}
