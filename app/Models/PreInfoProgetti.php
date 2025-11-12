<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PreInfoProgetti extends Model
{
    use HasFactory;

    protected $table = 'pre_info_progetti';

    protected $guarded = [
        'id'
    ];

    public function progettiruolo() {
        return $this->hasMany(PreInfoProgettiRuoli::class, 'pre_info_progetto_id');
    }

}
