<?php

namespace App\Models;

use App\Models\Contact;
use App\Models\CompanyAddress;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\Searchable\Searchable;
use Spatie\Searchable\SearchResult;

class Company extends Model implements Searchable
{
    use HasFactory, LogsActivity, Notifiable;

    protected $guarded = ['id'];

    protected $hidden = [
        'password', 'remember_token',
    ];

    protected $appends = [
        'assigned',
        'assigned2',
        'supervisore',
        'commerciale',
        'segnalatore',
    ];

    /**
     * The attribute for Log Activity
     */
    protected static $logUnguarded = true;
    protected static $ignoreChangedAttributes = ['updated_at'];
    protected static $logAttributesToIgnore = [ 'updated_at'];
    protected static $logName = 'Aziende';
    protected static $logOnlyDirty = true;

    public $searchableType = 'Aziende';

    public function getActivitylogOptions(): LogOptions
    {
        $logOptions = new LogOptions;
        $logOptions->logFillable();
        $logOptions->logOnlyDirty();

        return $logOptions;
    }

    public function getSearchResult(): SearchResult
    {
        $url = route('companyshow', $this->id);

        return new SearchResult(
            $this,
            $this->name,
            $url
         );
    }

    public function getAssignedAttribute() {
        if ($this->assigned_id && $this->assignedUser) {
            return $this->assignedUser->last_name . ' ' . $this->assignedUser->name;
        }
    }

    public function getAssigned2Attribute() {
        if ($this->assigned2_id && $this->assigned2User) {
            return $this->assigned2User->last_name . ' ' . $this->assigned2User->name;
        }
    }

    public function getSupervisoreAttribute() {
        if ($this->commercial_supervisor_id) {
            if ($user = User::find($this->commercial_supervisor_id)) {
                return $user->last_name . ' ' . $user->name;
            }
        }
    }

    public function getCommercialeAttribute() {
        if ($this->agent_id && $this->agent) {
            return $this->agent->name != null ? $this->agent->last_name . ' ' . $this->agent->name : '';
        }
    }

    public function getSegnalatoreAttribute() {
        if ($this->signaler_id) {
            if ($contact = Contact::find($this->signaler_id)) {
                return $contact->name != null ? $contact->last_name . ' ' . $contact->name : '';
            }
        }
    }

    public function addresses() {
        return $this->hasMany(CompanyAddress::class);
    }

    public function contacts() {
        return $this->belongsToMany(Contact::class, 'company_contacts');
    }

    public function tags() {
        return $this->hasMany(CompanyTag::class);
    }

    public function provincia() {
        return $this->hasOne(Provincies::class, 'id', 'province_id');
    }

    public function agent() {
        return $this->hasOne(Contact::class, 'id', 'agent_id');
    }

    public function signaler() {
        return $this->hasOne(Contact::class, 'id', 'signaler_id');
    }

    public function assignedUser() {
        return $this->hasOne(User::class, 'id', 'assigned_id');
    }

    public function assigned2User() {
        return $this->hasOne(User::class, 'id', 'assigned2_id');
    }

    public function opportunity() {
        return $this->hasMany(Opportunity::class, 'customer_id', 'id');
    }

    public function orders() {
        return $this->hasMany(Order::class, 'customer_id', 'id');
    }

}
