<?php

namespace App\Models;

use Carbon\Carbon;
use App\Models\Task;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Ordermilestone extends Model {

    use HasFactory;

    protected $guarded = [
        'id'
    ];

    protected $casts = [
        'datestart' => 'date:d-m-Y',
        'dateend' => 'date:d-m-Y',
    ];

    public function ordermilestonetasks() {
    	return $this->hasMany(Task::class, 'ordermilestone_id')->where('parent_id', 0)->orderBy('position');
    }

    public function ordermilestonecompletetasks() {
    	return $this->hasMany(Task::class, 'ordermilestone_id')->where('status', 2);
    }

    public function ordermilestoneuncompletetasks() {
    	return $this->hasMany(Task::class, 'ordermilestone_id')->where('status', 1);
    }
}
