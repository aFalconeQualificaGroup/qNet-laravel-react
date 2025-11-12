<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Templatebtypemilestone extends Model {

    use HasFactory;

    protected $guarded = [
        'id'
    ];

    public function templatemilestoneactions() {
        return $this->hasMany(Templatebtypemilestoneaction::class)->where('parent_id',0)->orderBy('prog');
    }
}
