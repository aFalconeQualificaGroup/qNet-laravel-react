<?php

namespace App\Models;

use Illuminate\Support\Facades\DB;
use Spatie\Activitylog\LogOptions;
use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Traits\LogsActivity;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Order extends Model {

    use HasFactory, LogsActivity;

    protected $guarded = [
        'id'
    ];

    protected $casts = [
        'datestart' => 'date:d-m-Y',
        'dateend'   => 'date:d-m-Y',
    ];

      /**
     * The attribute for Log Activity
     */
    protected static $logUnguarded = true;
    protected static $ignoreChangedAttributes = ['updated_at'];
    protected static $logAttributesToIgnore = [ 'updated_at'];
    protected static $logName = 'Commesse';
    protected static $logOnlyDirty = true;

    public $stato_consulenzas = [
        '1'  => 'Contatto Telefonico',
        '2'  => 'I° Contatto Email',
        '3'  => 'Intervista da Programmare',
        '4'  => 'Intervista da Programmare Telefonica',
        '5'  => 'Intervista Programmata Telefonica',
        '6'  => 'Intervista Programmata in Sede',
        '7'  => 'Intervista Eseguita',
        '8'  => 'Lavorazione Attesa Documenti',
        '9'  => 'Lavorazione Sistema',
        '10' => 'Lavorazione Conclusa o in fase Conclusiva',
        '11' => 'Consegnato Sistema Pagato',
        '12' => 'V.I. da Pianificare',
        '13' => 'V.I. Pianificata',
        '14' => 'V.I. Ente in Corso',
        '15' => 'V.I. Ente Conclusa',
        '16' => 'Attresa Report Ente',
        '17' => 'Chiusura NC',
        '18' => 'Completato',
    ];

    public function getActivitylogOptions(): LogOptions
    {
        $logOptions = new LogOptions;
        $logOptions->logFillable();
        $logOptions->logOnlyDirty();

        return $logOptions;
    }

    public function orderservices() {
    	return $this->hasMany(Orderservices::class);
    }

    public function quotation() {
        return $this->belongsTo(Quotation::class);
    }

    public function contact() {
        return $this->hasOne(Contact::class, 'id', 'contact_id');
    }

    public function customer() {
        return $this->hasOne(Company::class, 'id', 'customer_id');
    }

    public function companyAddress() {
        return $this->hasOne(CompanyAddress::class, 'id', 'site_id');
    }

    public function orderiso() {
        return $this->belongsTo(Orderiso::class, 'id', 'order_id');
    }

    public function orderisogare() {
        return $this->belongsTo(OrderisoGare::class, 'id', 'orderiso_id');
    }

    public function responsabileService() {
        return $this->belongsTo(ResponsabileService::class, 'id', 'id_order');
    }

    public function partecipantService() {
        return $this->belongsTo(PartecipantService::class, 'id', 'id_order');
    }

    public function orderdocuments() {
       return $this->hasMany(Orderdocument::class);
    }

    public function getCustomernameAttribute() {
        $customer = Company::find($this->customer_id);
        $name = !empty($customer) ? $customer->name  : '';
        return $name;
    }

    public function getSuppliernameAttribute() {
        $supplier = Company::find($this->supplier_id);
        $name = !empty($supplier) ? $supplier->name  : '';
        return $name;
    }

    public function getContactnameAttribute() {
        $contact = Contact::find($this->contact_id);
        $name = !empty($contact) ? $contact->last_name . ' ' . $contact->name  : '';
        return $name;
    }

    public function getSedeaddressAttribute() {
        $sedeAddress = CompanyAddress::find($this->site_id);
        if (!empty($sedeAddress)) {
            $name = $sedeAddress->address;
        }
        else {
            $sedeAddress = Company::find($this->customer_id);
            if ($sedeAddress) {
                $name = $sedeAddress->address;
            }
            else {
                $name = '';
            }
        }

        return $name;
    }

    public function getStatoconsulenzalistAttribute() {
        $stato = Orderiso::where('order_id', $this->id)->first();
        if ($stato != null) {
            $num = $stato->stato_consulenza;
            if ($num != null) {
                $description = $this->stato_consulenzas[$stato->stato_consulenza];
            }
            else {
                $description = '';
            }
            return $description;
        }
    }

    public function getStatoconsulenzaAttribute() {
        $stato = Orderiso::where('order_id', $this->id)->first();
        if ($stato != null) {
            $num = $stato['stato_consulenza'];
            if ($num != null) {
                $description = $this->stato_consulenzas[$num];
            }
            else {
                $description = '';
            }
            return $description;
        }
    }

    public function getTipoDocumentoAttribute() {
        $tipo = 'Non categorizzato';
        if ($this->type_document == 1) {
            $tipo = 'Contratti';
        }
        elseif ($this->type_document == 2) {
            $tipo = 'Contabile';
        }
        elseif ($this->type_document == 3) {
            $tipo = 'Lavorazioni';
        }
        elseif ($this->type_document == 4) {
            $tipo = 'Altro';
        }
        return $tipo;
    }

    public function getFullNameAttribute() {
        if ($user = User::find($this->user_id)) {
            return $user->name . ' ' . $user->last_name;
        }
    }

    public function getConsulenzaAttribute()
    {
        $commessa = Service::select('*')
            ->join('quotationservices', 'quotationservices.service_id' , 'services.id')
            ->join('orderservices', 'orderservices.quotation_service', 'quotationservices.id')
            ->where('orderservices.order_id', $this->id)
            ->where('folder',1)
            ->sum ('quotationservices.price');
        if ($commessa == '' || $commessa == 0 || $commessa == null)  {
            $order = Order::find($this->id);
            $quotation = Quotation::find($order->quotation_id);
            $orderservices = Orderservices::with('service')
                ->select(
                    'orderservices.id' ,
                    'orderservices.order_id',
                    'orderservices.service_id',
                    'orderservices.site_id',
                    'orderservices.quotation_service',
                    'orderservices.description',
                    'services.folder'
                )
                ->join('services', 'services.id', 'orderservices.service_id')
                ->where('order_id', $this->id)
                ->where('services.folder', 1)
                ->orderBy('services.folder', 'desc')
                ->get();
            foreach ($orderservices as $orderservice) {
                if ($quotation) {
                    foreach ($quotation->quotationservices as $qservice) {
                        if ($orderservice->service_id === $qservice->service_id) {
                            return $qservice->price;
                        }
                    }
                }

            }
        }
        return $commessa;
    }

    public function getEnteAttribute()
    {
        $commessa = Service::select('*')
            ->join('quotationservices', 'quotationservices.service_id' , 'services.id')
            ->join('orderservices', 'orderservices.quotation_service', 'quotationservices.id')
            ->where('orderservices.order_id', $this->id)
            ->where('folder',2)
            ->sum ('quotationservices.price');
        if ($commessa == '' || $commessa == 0 || $commessa == null)  {
            $order = Order::find($this->id);
            $quotation = Quotation::find($order->quotation_id);
            $orderservices = Orderservices::with('service')
                ->select(
                    'orderservices.id' ,
                    'orderservices.order_id',
                    'orderservices.service_id',
                    'orderservices.site_id',
                    'orderservices.quotation_service',
                    'orderservices.description',
                    'services.folder'
                )
                ->join('services', 'services.id', 'orderservices.service_id')
                ->where('order_id', $this->id)
                ->where('services.folder', 2)
                ->orderBy('services.folder', 'desc')
                ->get();
            foreach ($orderservices as $orderservice) {
                if ($quotation) {
                    foreach ($quotation->quotationservices as $qservice) {
                        if ($orderservice->service_id === $qservice->service_id) {
                            return $qservice->price;
                        }
                    }
                }
            }
        }
        return $commessa;
    }

    public function getConsulenzaIvataAttribute()
    {
        $commessa = Service::select('*')
            ->join('quotationservices', 'quotationservices.service_id' , 'services.id')
            ->join('orderservices', 'orderservices.quotation_service', 'quotationservices.id')
            ->where('orderservices.order_id', $this->id)
            ->where('folder',1)
            ->sum ('quotationservices.price');
        if ($commessa == '' || $commessa == 0 || $commessa == null)  {
            $order = Order::find($this->id);
            $quotation = Quotation::find($order->quotation_id);
            $orderservices = Orderservices::with('service')
                ->select(
                    'orderservices.id' ,
                    'orderservices.order_id',
                    'orderservices.service_id',
                    'orderservices.site_id',
                    'orderservices.quotation_service',
                    'orderservices.description',
                    'services.folder',
                    'rates.rate'
                )
                ->join('services', 'services.id', 'orderservices.service_id')
                ->join('rates', 'rates.id', 'services.rate_id')
                ->where('order_id', $this->id)
                ->where('services.folder', 1)
                ->orderBy('services.folder', 'desc')
                ->get();
            foreach ($orderservices as $orderservice) {
                if ($quotation) {
                    foreach ($quotation->quotationservices as $qservice) {
                        if ($orderservice->service_id === $qservice->service_id) {
                            return ($qservice->price + (($qservice->price * 22)/100));
                        }
                    }
                }

            }
        }
        return $commessa + (($commessa * 22)/100);
    }

    public function getVerificaAttribute()
    {
        $orderisoVerifica = OrderisoVerifica::where('orderiso_id', $this->id)
            ->orderBy('orderiso_verificas.id', 'DESC')
            ->first();

        return ($orderisoVerifica) ? $orderisoVerifica->data_verifica : null;
    }

    public function getAgenteAttribute()
    {
        if ($user = Contact::find($this->agent_id)) {
            return $user->last_name . ' ' . $user->name;
        }
    }

    public function getSegnalatoreAttribute()
    {
        if ($user = Contact::find($this->signaler_id)) {
            return $user->last_name . ' ' . $user->name;
        }
    }

    public function getImportoPagatoAttribute()
    {
        $importo = Proforma::select(
                'proformas.progressive',
                DB::raw("SUM(schedules.amount) as totale")
            )
            ->join('schedules', 'proformas.progressive', 'schedules.document_number')
            ->where('schedules.status', 3)
            ->where('proformas.order_id', $this->id)
            ->groupBy('proformas.id')
            ->first();

        return ($importo != null) ? $importo->totale : '';
    }

    public function getImportoResiduoAttribute()
    {
        $importo = Proforma::select(
                'proformas.progressive',
                DB::raw("SUM(schedules.amount) as totale")
            )
            ->join('schedules', 'proformas.progressive', 'schedules.document_number')
            ->where('schedules.status', 3)
            ->where('proformas.order_id', $this->id)
            ->groupBy('proformas.id')
            ->first();

        $commessa = Service::select('*')
            ->join('quotationservices', 'quotationservices.service_id', 'services.id')
            ->join('orderservices', 'orderservices.quotation_service', 'quotationservices.id')
            ->where('orderservices.order_id', $this->id)
            ->where('folder', 1)
            ->sum('quotationservices.price');

        if ($commessa == '' || $commessa == 0 || $commessa == null)  {
            $order = Order::find($this->id);
            $quotation = Quotation::find($order->quotation_id);
            $orderservices = Orderservices::with('service')
                ->select(
                    'orderservices.id' ,
                    'orderservices.order_id',
                    'orderservices.service_id',
                    'orderservices.site_id',
                    'orderservices.quotation_service',
                    'orderservices.description',
                    'services.folder'
                )
                ->join('services', 'services.id', 'orderservices.service_id')
                ->where('order_id', $this->id)
                ->where('services.folder', 1)
                ->orderBy('services.folder', 'desc')
                ->get();
            foreach ($orderservices as $orderservice) {
                if ($quotation) {
                    foreach ($quotation->quotationservices as $qservice) {
                        if ($orderservice->service_id === $qservice->service_id) {
                            return ($qservice->price + (($commessa * 22)/100)) - ($importo != null ? $importo->totale : 0);
                        }
                    }
                }
            }
        }
        $residuo = ($commessa + (($commessa * 22)/100)) - ($importo != null ? $importo->totale : 0);

        return $residuo;
    }

    /**
    * @return mixed
    */
    public function getDetailAttribute() {
        return $this->title;
    }

}
