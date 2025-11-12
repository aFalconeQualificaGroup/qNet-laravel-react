<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Document extends Model
{
    use HasFactory, Notifiable;

    protected $guarded = ['id'];

     /**
     * The attribute for Log Activity
    */
    protected static $logUnguarded = true;
    protected static $ignoreChangedAttributes = ['updated_at'];
    protected static $logAttributesToIgnore = [ 'updated_at'];
    protected static $logName = 'Document';
    protected static $logOnlyDirty = true;

    public function getFullNameAttribute() {
        $user = User::find($this->user_id);

        if ($user) {
            return "{$user->name} {$user->last_name }";
        }
        return "Inviato dal cliente";
    }

    public function getFullNameFrontAttribute() {
        $user = User::find($this->user_id);
        if ($user) {
            return "{$user->name} {$user->last_name }";
        }
        return "Inviato da cliente";
    }

    public function getTipoDocumentoAttribute() {
        $tipo = 'Non categorizzato';
        if ($this->type_document == 1) {
            $tipo = "Contratti";
        }
        elseif ($this->type_document == 2) {
            $tipo = "Contabile";
        }
        elseif ($this->type_document == 3) {
            $tipo = "Lavorazioni";
        }
        elseif ($this->type_document == 4) {
            $tipo = "Altro";
        }
        return $tipo;
    }

    public function user() {
        return $this->hasOne(User::class, 'id', 'user_id');
    }

}
