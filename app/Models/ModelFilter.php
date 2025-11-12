<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ModelFilter extends Model {

    use HasFactory;

    protected $table = 'filter_model';

    public function filterrow() {
    	return $this->hasMany(ModelFilterRow::class, 'filtermodel_id', 'id');
    }
}
