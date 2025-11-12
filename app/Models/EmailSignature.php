<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EmailSignature extends Model
{
    protected $fillable = ['name', 'content', 'user_id'];
}
