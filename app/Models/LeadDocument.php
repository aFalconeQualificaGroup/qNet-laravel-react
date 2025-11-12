<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LeadDocument extends Model
{
    use HasFactory;

    protected $guarded = [
        'id'
    ];

    public function getFullNameAttribute() {
        $fullName = '';
        $user = User::find($this->user_id);
        if ($user) {
            $fullName = "{$user->name} {$user->last_name }";
        }
        return $fullName;
    }

    public function getTipoDocumentoAttribute() {
        $typeDoc ='';
        switch ($this->type_document) {
            case 1:
                $typeDoc = "Altro";
                break;
            case 2:
                $typeDoc = "Iso";
                break;
            case 3:
                $typeDoc = "Soa";
                break;
            case 4:
                $typeDoc = "Sic";
                break;
            case 5:
                $typeDoc = "Avvalimenti";
                break;
            case 6:
                $typeDoc = "Gdpr";
                break;
            case 7:
                $typeDoc = "R&S";
                break;
            case 8:
                $typeDoc = "PAL";
                break;
            case 9:
                $typeDoc = "4.0";
                break;
            case 10:
                $typeDoc = "Finanza Agevolata";
                break;
            case 11:
                $typeDoc = "Fondi";
                break;
            case 12:
                $typeDoc = "Gare";
                break;
            case -1:
                $typeDoc = "Generico";
                break;
        }
        return $typeDoc;
    }
}
