<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Orderservices extends Model {
    use HasFactory;

    protected $guarded = [
        'id'
    ];

    public function order() {
    	return $this->belongsTo(Order::class);
    }

    public function service() {
        return $this->hasOne(Service::class, 'id', 'service_id');
    }

    public function quotationService() {
        return $this->hasOne(Quotationservice::class, 'id', 'quotation_service');
    }

    public function ordermilestone() {
    	return $this->hasMany(Ordermilestone::class, 'order_service')->orderBy('position');
    }

    public function areecollegate() {
        return $this->hasMany(Area::class, 'id_address', 'site_id');
    }

    public function getTitoloAttribute() {
        $service = Service::find($this->service_id);
        if ($service) {
            return $service->title;
        }
        return '';
    }

    public function getServizioAttribute() {
        $quotation_service = orderservices::select(
                'orderservices.id',
                'orderservices.order_id',
                'orderservices.service_id',
                'orderservices.site_id',
                'orderservices.quotation_service',
                'orderservices.description',
                'quotationservices.service_id',
                'quotationservices.description',
                'quotationservices.quantity',
                'quotationservices.price',
                'services.title',
            )
            ->where('quotationservices.id', $this->quotation_service)
            ->join('quotationservices', 'orderservices.quotation_service', 'quotationservices.id')
            ->join('services', 'orderservices.service_id', 'services.id')
            ->first();

        if ($quotation_service) {
            return $quotation_service;
        }
    }

}
