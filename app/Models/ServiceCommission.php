<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ServiceCommission extends Model {
    use HasFactory;

    protected $guarded = [
        'id'
    ];

    public function getServicenameAttribute()
    {
        $title = '';
        $name = Service::find($this->service_id);
        if ($name) {
            $title = $name->title;
        }
        return $title;
    }

    public function getCategorynameAttribute()
    {
        $title = '';
        $name = ServiceCategory::find($this->category_id);
        if ($name) {
            $title = $name->description;
        }
        return $title;
    }

    public function getCategorytreeAttribute()
    {
        $title = '';
        $category = ServiceCategory::find($this->category_id);
        if ($category) {
            if ($category->parent_id != null) {
                $parent = ServiceCategory::find($category->parent_id);
                $title = $parent->description . ' > ' . $category->description;
            }
            else {
                $title = $category->description;
            }
        }
        return $title;
    }

    public function getTipologianameAttribute()
    {
        $tipologia = '';
        if ($this->tipology == 1) {
            $tipologia = 'Commerciale';
        }
        elseif ($this->tipology == 2) {
            $tipologia = 'Segnalatore';
        }
        elseif ($this->tipology == 3) {
            $tipologia = 'Supervisore';
        }
        elseif ($this->tipology == 4) {
            $tipologia = 'Fornitore';
        }
        return $tipologia;
    }

}
