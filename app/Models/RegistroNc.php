<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RegistroNc extends Model
{
    use HasFactory;

    protected $table = 'registro_nc';
    protected $guarded = ['id'];

    protected $casts = [
        'data' => 'date:d-m-Y',
    ];

    public function piano_moglioramenti() {
    	return $this->hasMany(RegistroNcPm::class);
    }

    public function getFullNameAttribute() {
        if ($user = User::find($this->user_id)) {
            return $user->name . ' ' . $user->last_name;
        }
    }

}
