<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Filter extends Model {
    use HasFactory;

    protected $fillable = [
        'user_id',
        'name',
        'model',
        'type_role',
        'role',
        'role_segment',
    ];

    public function modelFilter()
    {
        return $this->hasOne(ModelFilter::class, 'model_name', 'model');
    }
}
