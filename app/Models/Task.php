<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

class Task extends Model
{
    use HasFactory, /*LogsActivity,*/ Notifiable;

    protected $guarded = [
        'id'
    ];

    protected $casts = [
        'datatask' => 'date:d-m-Y',
        'datataskend' => 'date:d-m-Y',
        'endtask' => 'date:d-m-Y',
        'timetask' => 'date:H:i',
        'timetaskend' => 'date:H:i',
    ];

    /**
     * The attribute for Log Activity
     */
    protected static $logUnguarded = true;

    protected static $ignoreChangedAttributes = ['updated_at'];
    protected static $logAttributesToIgnore = ['updated_at'];
    protected static $logName = 'Tasks';
    protected static $logOnlyDirty = true;
    protected static $recordEvents = ['created', 'updated', 'deleted'];

    public function getActivitylogOptions(): LogOptions
    {
        $logOptions = new LogOptions;
        $logOptions->logFillable();
        $logOptions->logOnlyDirty();

        return $logOptions;
    }

    public function getDescriptionForEvent(string $eventName): string
    {
        if ($eventName == 'updated') {
            return "L'attività è stata aggiornata";
        } elseif ($eventName == 'created') {
            return "Creata nuova attività";
        } else {
            return "L'attività è stata cancellata";
        }
    }

    /**
     * Get the assigned for the tasks.
     */
    public function taskassegnati()
    {
        return $this->hasMany(TaskAssigned::class);
    }

    public function assegnati()
    {
        return $this->hasMany(TaskAssigned::class);
    }

    public function taskdocumenti()
    {
        return $this->hasMany(TaskDocument::class);
    }


    public function tasksubs()
    {
        return $this->hasMany(TaskSub::class);
    }


    public function subtasks()
    {
        return $this->hasMany(Task::class, 'parent_id', 'id');
    }

    public function parenttask()
    {
        return $this->hasOne(Task::class, 'id', 'parent_id');
    }

    public function getOpportunitaAttribute()
    {
        if ($opportunity = Opportunity::find($this->opportunity_id)) {
            return $opportunity->title;
        }
    }

    public function getCommessaAttribute()
    {
        if ($order = Order::find($this->order_id)) {
            return $order->title;
        }
    }

    public function getFaseAttribute()
    {
        if ($fase = Ordermilestone::find($this->ordermilestone_id)) {
            return $fase->title;
        }
    }

    public function getClienteAttribute()
    {
        if ($this->customer_id && $this->customer) {
            return $this->customer->name;
        }
    }

    public function getSedeAttribute()
    {
        $address = '';
        $customer_address = CompanyAddress::find($this->site_id);
        if ($customer_address) {
            $address = $customer_address->address;
        }
        return $address;
    }

    public function getTypeAttribute()
    {
        switch ($this->typetask) {
            case 'T':
                return "Task";
                break;
            case 'I':
                return "Incontro";
                break;
            case 'C':
                return "Chiamata";
                break;
            case 'O':
                return "Intervento";
                break;
        }
    }

    public function getLocalitaAttribute()
    {
        switch ($this->location) {
            case '1':
                return "Sede CLiente";
                break;
            case '2':
                return "Nostra Sede";
                break;
            case '3':
                return "Virtuale";
                break;
        }
    }

    public function getAssegnatoAttribute()
    {
        if ($user = User::find($this->assigned_to)) {
            return $user->name . ' ' . $user->last_name;
        }
    }

    public function getCreatorAttribute()
    {
        if ($user = User::find($this->assigned_by)) {
            return $user->name . ' ' . $user->last_name;
        }
    }

    public function getUserTaskAttribute()
    {
        if ($user = User::find($this->user_id)) {
            return $user->name . ' ' . $user->last_name;
        }
    }

    public function getIndirizzoAttribute()
    {
        $ca = CompanyAddress::find($this->site_id);
        return $ca != '' ? $ca->address : '';
    }

    public function getAreaAttribute()
    {
        $ar = Area::find($this->area_id);
        return $ar != '' ? $ar->nome : '';
    }

    public function spazioAttivita()
    {
        return $this->hasOne(SpazioAttivita::class, 'id', 'id_attivita');
    }

    public function spazio()
    {
        return $this->hasOne(Spazio::class, 'id', 'id_spazio');
    }

    public function customer()
    {
        return $this->hasOne(Customer::class, 'id', 'customer_id');
    }

    public function messaggiContestazione()
    {
        return $this->hasMany(MessaggioContestazione::class, 'id_task', 'id');
    }

    public function operatori()
    {
        return $this->hasMany(TaskAssigned::class);
    }

    public function reportmod()
    {
        return $this->hasOne(Report::class);
    }
    public function osservatore()
    {
        return $this->hasOne(User::class, 'id', 'observer');
    }

    public function taskReminder()
    {
        return $this->hasOne(TaskReminder::class);
    }

}
