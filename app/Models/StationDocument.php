<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StationDocument extends Model
{
    use HasFactory;

    protected $table = 'station_document';

    protected $fillable = [
        'id_station',
        'id_type_document',
        'id_image',
        'created_at',
        'updated_at',
    ];


    public function TypeDocument() {
        return $this->belongsTo(TypeDocument::class, 'id_type_document', 'id');
    }

    public function Image() {
        return $this->belongsTo(ImagePlanimetry::class, 'id_image', 'id');
    }

    public function Station() {
        return $this->belongsTo(Station::class, 'id_station', 'id');
    }

}
