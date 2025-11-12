<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ActivityType extends Model
{
    use HasFactory;

    protected $guarded = ['id'];

    public function getTypeModelAttribute() {
        if ($this->type === 0) {
            return "Testo";
        }
        return "Video";
    }

    public function getTipotaskAttribute() {
        switch ($this->typetask) {
            case 'T':
                return 'Task';
                break;
            case 'I':
                return 'Incontro';
                break;
            case 'C':
                return 'Call';
                break;
            case 'O':
                return 'Intervento';
                break;
            default:
                return 'T';
                break;
        }
    }

    public function getTiposervizioAttribute() {
        switch ($this->typeservice) {
            case '1':
                return 'Standard';
                break;
            case '2':
                return 'Planimentria';
                break;
            case '3':
                return 'Mappa';
                break;
            default:
                return 'Standard';
                break;
        }
    }

}
