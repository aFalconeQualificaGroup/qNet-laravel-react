<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CompanySoa extends Model {
    use HasFactory;

    protected $casts = [
        'dateofiusse' => 'date:d-m-Y',
        'ver3' => 'date:d-m-Y',
        'ver5' => 'date:d-m-Y',
        'iso_emission' => 'date:d-m-Y',
    ];

    protected $guarded = ['id'];

    public function getCategoriaAttribute() {
        $cat = SoaCategory::find($this->category);
        if ($cat===null)
            return '';

        return $cat->code;
    }

    public function getClassificazioneAttribute() {
        $classif = SoaClassification::find($this->classification);
        if ($classif===null)
            return '';

        return $classif->code;
    }

}
