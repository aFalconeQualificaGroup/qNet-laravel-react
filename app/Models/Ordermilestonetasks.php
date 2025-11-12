<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Ordermilestonetasks extends Model {

    use HasFactory;

    protected $table = "tasks";

    protected $guarded = [
        'id'
    ];

    protected $casts = [
        'datatask' => 'date:d-m-Y',
    ];

    public function assigned()  {
        return $this->hasOne(User::class, 'id', 'assigned_to');
    }


    public function getTipotaskAttribute() {
        switch ($this->typetask) {
            case 'T':
                return 'Task';
                break;
            case 'C':
                return 'Chiamata';
                break;
            case 'O':
                return 'Intervento';
                break;
            default:
                return 'Incontro';
                break;
        }
    }

}
