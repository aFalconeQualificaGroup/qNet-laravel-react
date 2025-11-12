<?php

namespace App\Models;

use App\Utils\WhistleblowingStatuses;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Whistleblowing extends Model
{
    use HasFactory;

    public const MANAGER_ROLE = 'Admin';

    protected $guarded = ['id'];

    protected $casts = [
        'whistleblowing_areas_id' => 'array',
        'taken_in_at' => 'datetime',
    ];

    /**
     * @param $query
     * @return mixed
     */
    public function scopeOwnCompetence($query)
    {
        return $query->when(auth()->check()  &&  !auth()->user()->hasRole(self::MANAGER_ROLE), function ($qq) {
            $qq->where('whistleblower_id', auth()->id());
        });
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function messages()
    {
        return $this->hasMany(WhistleblowingMessage::class)->orderBy('id');
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasOne
     */
    public function firstMessage()
    {
        return $this->hasOne(WhistleblowingMessage::class)->oldestOfMany();
    }

    /**
     * @return array
     */
    public function getAreasAttribute(): array
    {
        $values =$this->whistleblowing_areas_id;
        $areas = WhistleblowingArea::whereIn('id', $values)->get();

        return collect($areas)->sortBy (fn($item) => array_search($item->id, $values))
            ->values()
            ->all();
    }

    /**
     * @return string|null
     */
    public function getStatusDescriptionAttribute(): string|null
    {
        return WhistleblowingStatuses::description($this->status);
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function whistleblower()
    {
        return $this->belongsTo(User::class)/*->whithTrashed()*/;
    }

    /**
     * @return string|null
     */
    protected function getPaddedIdAttribute(): string|null
    {
        return empty($this->id) ? NULL : str_pad ($this->id, 7, '0', STR_PAD_LEFT);
    }
}
