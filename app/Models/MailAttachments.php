<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MailAttachments extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'path'
    ];

    public function Mail() {
        return $this->belongsTo(Mail::class, 'id_mail','id');
    }

    public function Image() {
        return $this->belongsTo(ImagePlanimetry::class,'id_image','id');
    }

    public $timestamps = false;

}
