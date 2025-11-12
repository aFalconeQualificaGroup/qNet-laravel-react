<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EmailSetting extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'provider',
        'username',
        'password',
        'imap_host',
        'imap_porta',
        'smtp_host',
        'smtp_porta',
    ];

}
