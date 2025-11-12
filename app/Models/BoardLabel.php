<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BoardLabel extends Model
{
    use HasFactory;

    public function board()
    {
        return $this->hasOne(Board::class);
    }
}
