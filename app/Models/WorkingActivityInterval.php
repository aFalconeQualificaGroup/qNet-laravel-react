<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WorkingActivityInterval extends Model
{
    use HasFactory;

    protected $casts = [
        'from_time' => 'datetime:H:i',
        'to_time' => 'datetime:H:i',
    ];

    protected $guarded = ['id'];


    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function day()
    {
        return $this->belongsTo(WorkingActivityDay::class, 'working_activity_day_id');
    }
}
