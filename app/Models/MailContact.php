<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MailContact extends Model
{
    use HasFactory;

    //mail_contact

    protected $table = 'mail_contact';

    protected $fillable = [
        'email','id_mail','type_contact_mail','created_at','updated_at'
    ];

    public function Mail() {
        return $this->belongsTo(Mail::class, 'id_mail','id');
    }

}
