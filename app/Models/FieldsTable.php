<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FieldsTable extends Model
{
    use HasFactory;

    protected $table = 'fieldstable';

    protected $guarded = [
        'id'
    ];
}
