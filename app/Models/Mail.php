<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Mail extends Model
{
    use HasFactory;

    protected $table = 'mail';

    protected $fillable = [
        'from','object','message','id_status_mail','created_at','updated_at','deleted'
    ];


}
