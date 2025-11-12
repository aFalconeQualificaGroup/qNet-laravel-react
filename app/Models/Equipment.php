<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

class Equipment extends Model
{
    use HasFactory, LogsActivity;

    protected $guarded = [
        'id'
    ];

    /**
     * The attribute for Log Activity
     */
    protected static $logUnguarded = true;
    protected static $ignoreChangedAttributes = ['updated_at'];
    protected static $logAttributesToIgnore = [ 'updated_at'];
    protected static $logName = 'Attrezzature';
    protected static $logOnlyDirty = true;

    public function getActivitylogOptions(): LogOptions
    {
        $logOptions = new LogOptions;
        $logOptions->logFillable();
        $logOptions->logOnlyDirty();

        return $logOptions;
    }

    public function manutenzioni() {
        return $this->hasMany(EquipmentService::class);
    }

    public function getShortrateAttribute() {

        $rate = Rate::find($this->rate_id);
        if ($rate) {
            $shortdesc =  $rate->shortdesc;
        }
        else {
            $shortdesc =  '';
        }

        return $shortdesc;
    }

}
