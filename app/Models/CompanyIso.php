<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CompanyIso extends Model {
    use HasFactory;

    protected $guarded = ['id'];

    protected $casts = [
        'dateofiusse' => 'date:d-m-Y',
    ];

    public function getCodeAttribute() {
        $iso = Iso::find($this->iso_id);
        if ($iso) {
            $code = $iso->code;

        }
        else {
            $code = '';
        }
        return $code;
    }
}
