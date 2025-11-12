<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Purchase extends Model
{
    use HasFactory;

    protected $guarded = [
        'id'
    ];

    public function getCompanyAttribute() {
        $description = '';
        $company = Company::find($this->company_id);
        if ($company) {
            $description = $company->name;
        }
        return $description;
    }

    public function getCompanyAddressAttribute() {
        $description = '';
        $companyAddress = CompanyAddress::find($this->address_id);
        if ($companyAddress) {
            $description = $companyAddress->address . ' - ' . $companyAddress->city;
        }
        return $description;
    }

    public function getRichiestaAttribute() {
        $name = '';

        $user = User::find($this->created_by);
        if ($user) {
            $name = $user->last_name . ' ' . $user->name;
        }
        return $name;
    }
}
