<?php

namespace App\Models;

use App\Observers\ReportObserver;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

#[ObservedBy([ReportObserver::class])]
class Report extends Model {

    use HasFactory, LogsActivity;

    protected $guarded = [
        'id'
    ];

    protected $casts = [
        'datereport' => 'date:d-m-Y',
        'timestart' => 'date:H:i',
        'timeend' => 'date:H:i',
    ];

    public function getActivitylogOptions(): LogOptions
    {
        $logOptions = new LogOptions;
        $logOptions->logFillable();
        $logOptions->logOnlyDirty();

        return $logOptions;
    }

    public function task() {
        return $this->hasOne(Task::class, 'id', 'task_id');
    }

    public function getAssignedAttribute() {
        $user = User::find($this->assigned_to);
        if ($user){
            return $user->last_name . ' ' . $user->name;
        }
        return '';
    }

}
