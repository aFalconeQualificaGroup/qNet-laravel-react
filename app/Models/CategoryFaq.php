<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CategoryFaq extends Model {

    use HasFactory;

    protected $guarded = ['id'];

    public function roles() {
        return $this->hasMany(CategoryFaqRole::class);
    }

    public function childs() {
        return $this->hasMany(CategoryFaq::class, 'parent_id', 'id');
    }
}
