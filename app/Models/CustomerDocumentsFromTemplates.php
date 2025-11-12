<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\CustomerDocumentsLinesFromTemplates;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class CustomerDocumentsFromTemplates extends Model
{
    use HasFactory;

    protected $guarded = ['id'];

    public function documentsfromtemplateslines() {

    	return $this->hasMany(CustomerDocumentsLinesFromTemplates::class, 'cdft_id', 'id');
    }
}
