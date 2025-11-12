<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EmailAttachment extends Model
{
    use HasFactory;

    protected $fillable = [
        'email_id',
        'name',
        'path',
    ];

    public function email()
    {
        return $this->belongsTo(EmailDownload::class, 'email_id');
    }

}
