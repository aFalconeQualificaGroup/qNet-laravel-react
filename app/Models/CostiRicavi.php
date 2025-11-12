<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CostiRicavi extends Model
{
    use HasFactory;

    protected $table = 'costi_ricavi';

    protected $guarded = ['id'];

    public function childs() {
        return $this->hasMany(CostiRicavi::class,'parent_id','id');
    }
}
