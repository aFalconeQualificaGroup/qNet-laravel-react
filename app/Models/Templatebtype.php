<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Templatebtype extends Model {

    use HasFactory;

    protected $guarded = [
        'id'
    ];

    public function templatemilestones() {
        return $this->hasMany(Templatebtypemilestone::class)->orderBy('position');
    }

}
