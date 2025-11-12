<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WorkingActivityDay extends Model
{
    use HasFactory;

    protected $casts = [
        'is_auto' => 'boolean'
    ];

    protected $guarded = ['id'];


    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function intervals()
    {
        return $this->hasMany(WorkingActivityInterval::class, 'working_activity_day_id', 'id');
    }


    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     */
    public function lastInterval()
    {
        return $this->hasOne(WorkingActivityInterval::class, 'working_activity_day_id')->latestOfMany();
    }


    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function company()
    {
        return $this->belongsTo(Company::class);
    }


    /**
     * @return \Illuminate\Database\Eloquent\Relations\MorphTo
     */
    public function linkedTo()
    {
        return $this->morphTo();
    }
}
