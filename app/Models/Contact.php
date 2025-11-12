<?php

namespace App\Models;

use App\Models\Company;
use App\Observers\ContactObserver;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\Searchable\Searchable;
use Spatie\Searchable\SearchResult;

#[ObservedBy([ContactObserver::class])]
class Contact extends Authenticatable implements Searchable
{
    use HasFactory, LogsActivity, Notifiable;

    protected $guarded = ['id'];

    /**
     * The attribute for Log Activity
     */
    protected static $logUnguarded = true;
    protected static $ignoreChangedAttributes = ['updated_at'];
    protected static $logAttributesToIgnore = [ 'updated_at'];
    protected static $logName = 'Contatti';
    protected static $logOnlyDirty = true;

    public $searchableType = 'Contatti';

    public function getActivitylogOptions(): LogOptions
    {
        $logOptions = new LogOptions;
        $logOptions->logFillable();
        $logOptions->logOnlyDirty();

        return $logOptions;
    }

    public function getSearchResult(): SearchResult
    {
        $url = route('contactshow', $this->id);

        return new SearchResult(
            $this,
            $this->last_name . ' ' .$this->name,
            $url
        );
    }

    public function getFullNameAttribute() {
        if (is_null($this->last_name)) {
            return "{$this->name}";
        }
        return "{$this->last_name} {$this->name}";
    }

    public function getProvinceAttribute() {
        $descrizione = '';
        $province = Provincies::find($this->province_id);
        if ($province) {
            $descrizione = ' (' . $province->sigla . ' )';
        }

        return $descrizione;
    }

    public function getTypecontactAttribute() {
        $ct = ContactType::find($this->type);

        if ($ct) {
            return $ct->description;
        }
    }

    public function getNationAttribute() {
        if ($this->nation_id) {
            if ($nation = Nations::find($this->nation_id)) {
                return $nation->description;
            }
        }
    }

    public function companies()
    {
        return $this->belongsToMany(Company::class, 'company_contacts');
    }

    public function tags()
    {
        return $this->hasMany(ContactTag::class);
    }

}
