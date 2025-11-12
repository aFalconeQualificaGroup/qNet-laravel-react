<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

class Quotation extends Model {

    use HasFactory, LogsActivity;

    protected $guarded = [
        'id'
    ];

    protected $casts = [
        'datequotation'           => 'date:d-m-Y',
        'accepted_validated_data' => 'date:d-m-Y',
        'accepted_data'           => 'date:d-m-Y',
        'validated_data'          => 'date:d-m-Y',
        'declined_data'           => 'date:d-m-Y',
        'renewal_date'            => 'date:d-m-Y',
    ];

    /**
     * The attribute for Log Activity
     */
    protected static $logUnguarded = true;
    protected static $ignoreChangedAttributes = ['updated_at'];
    protected static $logAttributesToIgnore = [ 'updated_at'];
    protected static $logName = 'Quotazioni';
    protected static $logOnlyDirty = true;

    public function getActivitylogOptions(): LogOptions
    {
        $logOptions = new LogOptions;
        $logOptions->logFillable();
        $logOptions->logOnlyDirty();

        return $logOptions;
    }

    public function quotationemployees() {
    	return $this->hasMany(Quotationemployee::class);
    }

    public function quotationequipments() {
    	return $this->hasMany(Quotationequipment::class);
    }

    public function quotationvehicles() {
    	return $this->hasMany(Quotationevehicle::class);
    }

    public function quotationproducts() {
    	return $this->hasMany(Quotationproduct::class);
    }

    public function quotationservices() {
    	return $this->hasMany(Quotationservice::class);
    }

    public function quotationexpensereports() {
    	return $this->hasMany(Quotationexpensereport::class);
    }

    public function quotationsites() {
    	return $this->hasMany(Quotationsite::class);
    }

    public function opportunity() {
        return $this->hasOne(Opportunity::class, 'id', 'opportunity_id');
    }

    public function customer() {
        return $this->hasOne(Customer::class, 'id', 'customer_id');
    }

    public function contact() {
        return $this->hasOne(Contact::class, 'id', 'contact_id');
    }

    public function commerciale() {
        return $this->hasOne(Contact::class, 'id', 'agent_id');
    }

    public function segnalatore() {
        return $this->hasOne(Contact::class, 'id', 'signaler_id');
    }

    public function getQuotationStatusAttribute() {
        if ($this->status_quotation === 0) {
            return 'Presentate';
        }
        elseif ($this->status_quotation === 1) {
            return 'Accettate';
        }
        elseif ($this->status_quotation === 2) {
            return 'Contrattualizzate';
        }
        elseif ($this->status_quotation === 3) {
            return 'Validate';
        }
        elseif ($this->status_quotation === 4) {
            return 'Scaduto';
        }
        elseif ($this->status_quotation === 6) {
            return 'Scaduto';
        }
        elseif ($this->status_quotation === 5) {
            return 'Rifiutati';
        }
    }

    public function getOpportunitynameAttribute() {
        $name = Opportunity::find($this->opportunity_id);
        if ($name) {
            $na = $name->title;
        }
        else {
            $na = '';
        }
        return $na;
    }

    public function getCustomernameAttribute() {
        if ($customer = $this->customer) {
            return ($customer->name != null) ? $customer->name : '';
        }
        return '';
    }

    public function getContactnameAttribute() {
        if ($contact = $this->contact) {
            return ($contact->name != null) ? $contact->last_name . ' ' . $contact->name : '';
        }
        return '';
    }

    public function getCommercialenameAttribute() {
        if ($contact = $this->commerciale) {
            return ($contact->name != null) ? $contact->last_name . ' ' . $contact->name : '';
        }
        return '';
    }

    public function getSignalernameAttribute() {
        $name = "";
        $contact = Contact::find($this->signaler_id);
        if ($contact) {
            $name = $contact->name != null ? $contact->last_name . ' ' . $contact->name : '';
        }
        return $name;
    }

    public function getAddressAttribute() {
        $address = "";
        $customer = Company::find($this->customer_id);
        if ($customer) {
            $address = $customer->address != null ? $customer->address : '';
        }
        return $address;
    }

    public function getCityAttribute() {
        $city = "";
        $customer = Company::find($this->customer_id);
        if ($customer) {
            $city = $customer->zip . ' ' .  $customer->city;
        }
        return $city;
    }

    public function getPivaAttribute() {
        $piva = "";
        $customer = Company::find($this->customer_id);
        if ($customer) {
            $piva = $customer->piva;
        }
        return $piva;
    }

    public function getTipoDocumentoAttribute() {

        $tipo = 'Non categorizzato';
        if ($this->type_document == 1) {
            $tipo = "Contratti";
        }
        elseif ($this->type_document == 2) {
            $tipo = "Contabile";
        }
        elseif ($this->type_document == 3) {
            $tipo = "Lavorazioni";
        }
        elseif ($this->type_document == 4) {
            $tipo = "Altro";
        }
        return $tipo;
    }

    public function getFullNameAttribute() {
        if ($user = User::find($this->user_id)) {
            return $user->name . ' ' . $user->last_name;
        }
    }

    public function getBusinessAttribute() {
        if ($business_unit = CompanyProfile::find($this->business_unit)) {
            return $business_unit->name;
        }
    }

    public function totFolder1($id)
    {
        $totFolder1 = 0;
        $qss = Quotationservice::select('quotationservices.id', 'quotationservices.quantity', 'quotationservices.price', 'services.folder')
            ->where('quotation_id', $id)
            ->leftJoin('services', 'services.id', 'service_id')
            ->get();
        foreach ($qss as $qs) {
            if ($qs->folder == 1 || $qs->folder == null) {
                $totFolder1 += $qs->quantity * $qs->price;
            }

        }
        return $totFolder1;
    }

    public function totFolder2($id)
    {
        $totFolder2 = 0;
        $qss = Quotationservice::select('quotationservices.id', 'quotationservices.quantity', 'quotationservices.price', 'services.folder')
            ->where('quotation_id', $id)
            ->leftJoin('services', 'services.id', 'service_id')
            ->get();
        foreach ($qss as $qs) {
            if ($qs->folder == 2) {
                $totFolder2 += $qs->quantity * $qs->price;
            }
        }
        return $totFolder2;
    }

    public function totSupervisor($id)
    {
        $totale = Quotationservice::select('supervisor_cost')
            ->where('quotation_id', $id)
            ->sum('supervisor_cost');
        return $totale;
    }

    public function totSignaler($id)
    {
        $totale = Quotationservice::select('signaler_cost')
            ->where('quotation_id', $id)
            ->sum('signaler_cost');
        return $totale;
    }

    public function totAgent($id)
    {
        $totale = Quotationservice::select('agent_cost')
            ->where('quotation_id', $id)
            ->sum('agent_cost');
        return $totale;
    }

    public function totNetto($id)
    {
        $quotation = Quotation::select('total')->where('id', $id)->first();
        $totaleSignaler = Quotationservice::select('signaler_cost')
            ->where('quotation_id', $id)
            ->sum('signaler_cost');
        $totaleAgent = Quotationservice::select('agent_cost')
            ->where('quotation_id', $id)
            ->sum('agent_cost');
        $totaleSupervisor = Quotationservice::select('supervisor_cost')
            ->where('quotation_id', $id)
            ->sum('supervisor_cost');
        return $quotation->total - ($totaleSignaler + $totaleAgent + $totaleSupervisor);
    }

    public function statoContratto($stato)
    {
        if ( $stato==1 ) {
            return 'Da Validare';
        }
        elseif($stato==3) {
            return 'Da Programmare';
        }
        elseif($stato==2) {
            return 'Programmati';
        }
        elseif($stato==5) {
            return 'Annullati';
        }
        elseif($stato==4) {
            return 'Scadenza Contratto';
        }
        else {
            return '';
        }
    }

}
