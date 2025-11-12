<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RegistroNcPm extends Model
{
    use HasFactory;

    protected $table = 'registro_nc_pm';
    protected $guarded = ['id'];

    protected $casts = [
        'data' => 'date:d-m-Y',
    ];

    public function getFullNameAttribute() {
        if ($user = User::find($this->responsabile_id)) {
            return $user->name . ' ' . $user->last_name;
        }
    }
}
