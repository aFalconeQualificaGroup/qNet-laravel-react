<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class Quotationservice extends Model {
    use HasFactory;

    protected $guarded = [
        'id'
    ];

    public function quotation() {
    	return $this->belongsTo(Quotation::class);
    }

    public function service() {
        return $this->hasOne(Service::class, 'id', 'service_id');
    }

    public function getServicenameAttribute() {
        $name = Service::find($this->service_id);
        return ($name === null) ? '' : $name->title;
    }

    public function getTypefolderAttribute() {
        if ($this->service) {
            return ($this->service->folder == 1) ? 'Consulenza' : 'Ente';
        }
        return '?';
    }

    public function scadenza($data_quotation) {
        if ($this->service) {
            $data_scadenza = $data_quotation->addMonth($this->service->months_expiration);
        }
        else {
            $data_scadenza = $data_quotation;
        }
        return $data_scadenza;
    }

    public function categoria($service_id)
    {
        $nome = '//';

        if ($service = Service::find($service_id)) {
            if ($service_category = ServiceCategory::find($service->category_service)) {
                $nome = $service_category->description;
            }
        }
        return $nome;
    }

    public function categoriaMadre($service_id)
    {
        $nome = '//';

        if ($service = Service::find($service_id)) {
            if ($service_category = ServiceCategory::find($service->category_service)) {
                if ($service_category->parent_id != 0) {
                    $service_madre = ServiceCategory::find($service_category->parent_id);
                    if ($service_madre)
                        $nome = $service_madre->description;
                }
                else {
                    $nome = $service_category->description;
                }
            }
        }
        return $nome;
    }

    public function areecollegate() {
        return $this->hasMany(Area::class, 'id_address', 'site_id');
    }

    public function getAgenteAttribute()
    {
        if ($agente = Contact::find($this->agent_id)) {
            $full_name = $agente->last_name . ' ' . $agente->name;
        }
    }

    public function getSegnalatoreAttribute()
    {
        if ($segnalatore = Contact::find($this->signaler_id)) {
            return $segnalatore->last_name . ' ' . $segnalatore->name;
        }
    }

    public function getSupervisoreAttribute()
    {
        if ($supervisore = User::find($this->supervisor_id)) {
            $full_name = $supervisore->last_name . ' ' . $supervisore->name;
        }
    }

    public function products()
    {
        return $this->hasMany(Quotationproduct::class, 'quotation_id', 'quotation_id')
            ->where('service_id', $this->service_id);
    }

    public function employees()
    {
        return $this->hasMany(Quotationemployee::class, 'quotation_id', 'quotation_id')
            ->where('service_id', $this->service_id);
    }

    public function vehicles()
    {
        return $this->hasMany(Quotationevehicle::class, 'quotation_id', 'quotation_id')
            ->where('service_id', $this->service_id);
    }

    public function expensereports()
    {
        return $this->hasMany(Quotationexpensereport::class, 'quotation_id', 'quotation_id')
            ->where('service_id', $this->service_id);
    }

    public function equipments()
    {
        return $this->hasMany(Quotationequipment::class, 'quotation_id', 'quotation_id')
            ->where('service_id', $this->service_id);
    }

    public function getTotalProductsAttribute()
    {
        return $this->products()->sum(DB::raw('price * quantity'));
    }

    public function getTotalEmployeesAttribute()
    {
        return $this->employees()->sum(DB::raw('cost * hour'));
    }

    public function getTotalVehiclesAttribute()
    {
        return $this->vehicles()->sum(DB::raw('price * quantity'));
    }

    public function getTotalExpenseReportsAttribute()
    {
        return $this->expensereports()->sum(DB::raw('price * quantity'));
    }

    public function getTotalEquipmentsAttribute()
    {
        return $this->equipments()->sum(DB::raw('price * quantity'));
    }

    public function getTotalCommissionAttribute()
    {
        return $this->agent_cost + $this->supervisor_cost + $this->signaler_cost;
    }

    public function getTotalCostsAttribute()
    {
        return $this->total_products + $this->total_employees + $this->total_vehicles + $this->total_expense_reports + $this->total_equipments + $this->total_commission;
    }

}
