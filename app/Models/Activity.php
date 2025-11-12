<?php

namespace App\Models;

use App\Observers\ActivityObserver;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;
use Spatie\Activitylog\Models\Activity as ActivityModel;

#[ObservedBy([ActivityObserver::class])]
class Activity extends ActivityModel
{

}
