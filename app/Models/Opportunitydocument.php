<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

class Opportunitydocument extends Model
{
    use HasFactory;

    protected $guarded = [
        'id'
    ];

    public function getActivitylogOptions(): LogOptions
    {
        $logOptions = new LogOptions;
        $logOptions->logFillable();
        $logOptions->logOnlyDirty();

        return $logOptions;
    }

    public function getFullNameAttribute() {

        $user = User::find($this->user_id);

        if ($user) {
            return "{$user->name} {$user->last_name }";
        }

        return "";
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

    public function getViewAttribute() {
        $view = '';
        if ($this->view_document == 1) {
            $view = "Anagrafica";
        }
        elseif ($this->view_document == 2) {
            $view = "Contratti";
        }
        elseif ($this->view_document == 3) {
            $view = 'Anagrafica+Contratti';
        }
        return $view;
    }

}
