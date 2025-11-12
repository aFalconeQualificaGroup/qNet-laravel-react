<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ServiceCategory extends Model
{
    use HasFactory;

    protected $guarded = [
        'id'
    ];

    public function childs() {
        return $this->hasMany(ServiceCategory::class,'parent_id','id');
    }

}
