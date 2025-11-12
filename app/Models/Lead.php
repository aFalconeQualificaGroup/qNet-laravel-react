<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Lead extends Model
{
    use HasFactory;

    protected $casts = [
        'manage_date'   => 'date:d-m-Y',
        'created_at'    => 'date:d-m-Y',
        'updated_at'    => 'date:d-m-Y',
    ];

    protected $guarded = [
        'id'
    ];

    public function types() {
        return $this->hasMany(LeadsType::class, 'lead_id');
    }

    public function categories() {
        return $this->hasMany(LeadSoaCategory::class, 'lead_id')->orderBy('category');
    }

    public function documents() {
        return $this->hasMany(LeadDocument::class);
    }

    public function documentAltros() {
        return $this->hasMany(LeadDocument::class)->where('type_document', 1);
    }

    public function documentIsos() {
        return $this->hasMany(LeadDocument::class)->where('type_document', 2);
    }

    public function documentSoas() {
        return $this->hasMany(LeadDocument::class)->where('type_document', 3);
    }

    public function documentSics() {
        return $this->hasMany(LeadDocument::class)->where('type_document', 4);
    }

    public function documentAvvs() {
        return $this->hasMany(LeadDocument::class)->where('type_document', 5);
    }

    public function documentGdprs() {
        return $this->hasMany(LeadDocument::class)->where('type_document', 6);
    }

    public function documentRess() {
        return $this->hasMany(LeadDocument::class)->where('type_document', 7);
    }

    public function documentPals() {
        return $this->hasMany(LeadDocument::class)->where('type_document', 8);
    }

    public function documentQuattros() {
        return $this->hasMany(LeadDocument::class)->where('type_document', 9);
    }

    public function documentFinages() {
        return $this->hasMany(LeadDocument::class)->where('type_document', 10);
    }

    public function documentFondis() {
        return $this->hasMany(LeadDocument::class)->where('type_document', 11);
    }

    public function documentGares() {
        return $this->hasMany(LeadDocument::class)->where('type_document', 12);
    }

    public function commerciale() {
        return $this->hasOne(Contact::class, 'id', 'commercial_id');
    }

    public function segnalatore() {
        return $this->hasOne(Contact::class, 'id', 'signaler_id');
    }

    public function contatto() {
        return $this->hasOne(Contact::class, 'id', 'contact_id');
    }

    public function getTipoAppuntamentoAttribute() {
        $description = '';
        $LeadType = LeadType::find($this->lead_type);
        if ($LeadType) {
            $description = $LeadType->description;
        }
        return $description;
    }

    public function getContactTipoAttribute() {
        $name = '';
        $tipo = '';
        $contactType = ContactType::find($this->contact_type);
        if ($contactType) {
            if ($this->continex == 0) {
                $tipo = 'Interno';
            }
            else {
                $tipo = 'Esterno';
            }
            $name = $contactType->description . ' - ' . $tipo;
        }
        return $name;
    }

    public function getProvinciaAttribute() {
        if ($this->province_id) {
            if ($provincia = Provincies::find($this->province_id)) {
                return $provincia->provincia;
            }
        }
    }

    public function getManageAttribute() {
        if ($this->manage_id) {
            if ($user = User::find($this->manage_id)) {
                $manage = $user->last_name . ' ' . $user->name;
            }
        }
    }

    public function getCreatoAttribute() {
        if ($this->user_id) {
            if ($user = User::find($this->user_id)) {
                return $user->last_name . ' ' . $user->name;
            }
        }
    }

    public function getOpportunitaAttribute() {
        if ($this->opportunity_id) {
            if ($opportunity = Opportunity::find($this->opportunity_id)) {
                return $opportunity->title;
            }
        }
    }

    public function getMedicoNameAttribute() {
        $fullName = '';
        $user = User::find($this->medico_id);
        if ($user) {
            $fullName = "{$user->name} {$user->last_name }";
        }
        return $fullName;
    }

}
