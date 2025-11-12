<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

class Service extends Model
{
    use HasFactory;

    protected $guarded = [
        'id'
    ];

     /**
     * The attribute for Log Activity
     */
    protected static $logUnguarded = true;
    protected static $ignoreChangedAttributes = ['updated_at'];
    protected static $logAttributesToIgnore = [ 'updated_at'];
    protected static $logName = 'Servizi';
    protected static $logOnlyDirty = true;

    public function getActivitylogOptions(): LogOptions
    {
        $logOptions = new LogOptions;
        $logOptions->logFillable();
        $logOptions->logOnlyDirty();

        return $logOptions;
    }

    public function getServicetypeAttribute() {
        $ts = [
            '1' => 'Standard',
            '2' => 'Planimetria',
            '3' => 'Mappa'
        ];
        if ($this->type_service == '') {
            $this->type_service = 1;
        }
        return $ts[$this->type_service];
    }

    public function getSpectypeAttribute() {
        $ss = [
            '0'  => 'NESSUNA CARD',
            '1'  => 'ALTRO',
            '2'  => 'ISO',
            '3'  => 'SOA',
            '4'  => 'SICUREZZA',
            '5'  => 'AVVALIMENTI',
            '6'  => 'GDPR',
            '7'  => 'R&S',
            '8'  => 'PAL',
            '9'  => '4.0',
            '10' => 'FINANZA AGEVOLATA',
            '11' => 'FONDI',
            '12' => 'GARE',
            '13' => 'PARTNERSHIPS SEDI',
            '14' => 'PROGETTI',
            '15' => 'ISTRUZIONE',
            '16' => 'FORMAZIONE GOL',
        ];
        if ($this->spec_service == '') {
            $this->spec_service = 1;
        }
        return $ss[$this->spec_service];
    }

    public static function getSpectypeOptions()
    {
        return [
            '1'  => 'ALTRO',
            '2'  => 'ISO',
            '3'  => 'SOA',
            '4'  => 'SICUREZZA',
            '5'  => 'AVVALIMENTI',
            '6'  => 'GDPR',
            '7'  => 'R&S',
            '8'  => 'PAL',
            '9'  => '4.0',
            '10' => 'FINANZA AGEVOLATA',
            '11' => 'FONDI',
            '12' => 'GARE',
            '13' => 'PARTNERSHIPS SEDI',
            '14' => 'PROGETTI',
            '15' => 'ISTRUZIONE',
            '16' => 'FORMAZIONE GOL',
        ];
    }

    public static function getSpectypeByValue($value)
    {
        $options = self::getSpectypeOptions();
        return $options[$value] ?? 'ALTRO';
    }

    public function getShortrateAttribute() {
        if ($rate = Rate::find($this->rate_id)) {
            return $rate->shortdesc;
        }
    }

    public function getCategoriaAttribute() {
        if ($categoria = ServiceCategory::find($this->category_service)) {
            return $categoria->description;
        }
    }

    public function getFornitoreAttribute() {
        if ($fornitore = Company::find($this->supplier_id)) {
            return $fornitore->name;
        }
    }

    public function serviceCategory()
    {
        return $this->hasOne(ServiceCategory::class, 'id', 'category_service');
    }
}
