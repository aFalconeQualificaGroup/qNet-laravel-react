<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LeadsType extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $guarded = [
        'id'
    ];

    public function getTipoAttribute() {
        if ($lt = LeadType::find($this->lead_type_id)) {
            return $lt->description;
        }
    }
}
