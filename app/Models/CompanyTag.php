<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CompanyTag extends Model
{
    use HasFactory;

    protected $guarded = ['id'];

    public function tag()
    {
        return $this->hasOne(Tag::class, 'id', 'tag_id');
    }
}
