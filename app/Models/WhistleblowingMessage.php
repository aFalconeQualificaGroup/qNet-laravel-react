<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;


class WhistleblowingMessage extends Model
{
    use HasFactory;

    protected static $unguarded = true;
    protected $casts = ['attachments' => 'array'];



    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function whistleblowing()
    {
        return $this->belongsTo(Whistleblowing::class);
    }


    /**
     * @return mixed
     */
    public function answerManager()
    {
        return $this->belongsTo(User::class)/*->whithTrashed()*/;
    }
}
