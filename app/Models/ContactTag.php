<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ContactTag extends Model
{
    use HasFactory;

    protected $guarded = ['id'];

    public function getDescrizioneAttribute() {
        $tag = Tag::find($this->tag_id);

        if ($tag){
            $des = $tag->description;
        }
        else {
            $des = '';
        }

        return $des;
    }
}
