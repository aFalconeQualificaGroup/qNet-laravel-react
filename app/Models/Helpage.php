<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Helpage extends Model
{
    protected $fillable = [
        'title',
        'description',
        'url_video',
        'slug',
    ];

    protected $hidden = [
        'created_at',
        'updated_at',
    ];
}
