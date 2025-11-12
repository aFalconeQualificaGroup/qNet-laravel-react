<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Orderdocument extends Model
{
    use HasFactory;

    protected $guarded = [
        'id'
    ];

    protected $casts = [
        'created_at' => 'date:d-m-Y',
    ];

    public function getFullNameAttribute() {
        if ($user = User::find($this->user_id)) {
            return $user->name . ' ' . $user->last_name;
        }
    }

    public function getTipoDocumentoAttribute() {
        $tipo = 'Non categorizzato';
        if ($this->type_document == 1){
            $tipo = 'Contratti';
        }
        elseif ($this->type_document == 2) {
            $tipo = 'Contabile';
        }
        elseif ($this->type_document == 3) {
            $tipo = 'Lavorazioni';
        }
        elseif ($this->type_document == 4) {
            $tipo = 'Altro';
        }
        return $tipo;
    }

    public function user() {
        return $this->hasOne(User::class, 'id', 'user_id');
    }

}
