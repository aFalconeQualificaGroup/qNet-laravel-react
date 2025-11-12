<?php

namespace App\Models;

use Carbon\Carbon;
use App\Models\Opportunityfase;
use Spatie\Searchable\Searchable;
use Spatie\Activitylog\LogOptions;
use Spatie\Searchable\SearchResult;
use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Traits\LogsActivity;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Opportunity extends Model implements Searchable
{
    use HasFactory, LogsActivity;

    protected $guarded = [
        'id'
    ];

    protected $casts = [
        'date_start'     => 'date:d-m-Y',
        'date_end'       => 'date:d-m-Y',
        'accepted_data'  => 'date:d-m-Y',
        'validated_date' => 'date:d-m-Y',
        'status_date_1'  => 'date:d-m-Y',
        'status_date_2'  => 'date:d-m-Y',
        'status_date_3'  => 'date:d-m-Y',
        'status_date_4'  => 'date:d-m-Y',
        'status_date_5'  => 'date:d-m-Y',
        'status_date_6'  => 'date:d-m-Y',
    ];

    /**
     * The attribute for Log Activity
     */
    protected static $logUnguarded = true;
    protected static $ignoreChangedAttributes = ['updated_at'];
    protected static $logAttributesToIgnore = [ 'updated_at'];
    protected static $logName = 'Opportunità';
    protected static $logOnlyDirty = true;

    public $searchableType = 'Opportunità';

    public function getActivitylogOptions(): LogOptions
    {
        $logOptions = new LogOptions;
        $logOptions->logFillable();
        $logOptions->logOnlyDirty();

        return $logOptions;
    }

    public function getSearchResult(): SearchResult
    {
        $url = route('detail', $this->id);

        return new SearchResult(
            $this,
            $this->title,
            $url
         );
    }

    public function commerciale()
    {
        return $this->hasOne(Contact::class, 'id', 'commerciale_id');
    }

    public function segnalatore()
    {
        return $this->hasOne(Contact::class, 'id', 'segnalatore_id');
    }

    public function quotation()
    {
        return $this->belongsTo(Quotation::class, 'id', 'opportunity_id');
    }

    public function serviceCategory()
    {
        return $this->hasOne(ServiceCategory::class, 'id', 'service_id');
    }

    public function company()
    {
        return $this->hasOne(Company::class, 'id', 'customer_id');
    }

    public function contact()
    {
        return $this->hasOne(Contact::class, 'id', 'contact_id');
    }

    public function companies(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    public function contacts(): BelongsTo
    {
        return $this->belongsTo(Contact::class);
    }

    public function assigned()
    {
        return $this->hasOne(User::class, 'id', 'assigned_to');
    }

    public function fase()
    {
        return $this->hasOne(Fase::class, 'id', 'status');
    }

    public function opportunityfases()
    {
    	return $this->hasMany(Opportunityfase::class);
    }

    public function getFaseAttribute()
    {
        if ($fase = Fase::find($this->status)) {
            return $fase->title;
        }
    }

    public function getFineAttribute() {
        if (!empty($this->date_end))
            return Carbon::createFromFormat('Y-m-d', $this->date_end)->format('d/m/Y');
    }

    public function getFonteAttribute() {
        $source = Source::find($this->source);

        return $source != '' ? $source->description : '';
    }

    public function getAssegnatoAttribute() {
        if ($user = User::find($this->assigned_to)) {
            return $user->last_name . ' ' . $user->name;
        }
    }

    public function getAssegnato2Attribute() {
        if ($user = User::find($this->assigned2_to)) {
            return $user->last_name . ' ' . $user->name;
        }
    }

    public function getAssegnato3Attribute() {
        if ($user = User::find($this->assigned3_to)) {
            return $user->last_name . ' ' . $user->name;
        }
    }

    public function getAssegnato4Attribute() {
        if ($user = User::find($this->assigned4_to)) {
            return $user->last_name . ' ' . $user->name;
        }
    }

    public function getCustomerAttribute() {
        if ($customer = Company::find($this->customer_id)) {
            return $customer->name;
        }
    }

    public function getCustomerTelefonoAttribute() {
        if ($customer = Company::find($this->customer_id)) {
            return $customer->phone;
        }
    }

    public function getCustomerMailAttribute() {
        if ($customer = Company::find($this->customer_id)) {
            return $customer->email;
        }
    }

    public function getContactAttribute() {
        if ($contact = Contact::find($this->contact_id)) {
            return $contact->name . ' ' . $contact->last_name;
        }
    }

    public function getContactTelefonoAttribute() {
        if ($contact = Contact::find($this->contact_id)) {
            return $contact->phone  .  ($contact->phone != null ? ' / ' . $contact->mobile : $contact->mobile);
        }
    }

    public function getContactMailAttribute() {
        if ($contact = Contact::find($this->contact_id)) {
            return $contact->email;
        }
    }

    /**
     * @return mixed
     */
    public function getDetailAttribute() {
        return $this->title;
    }

}
