<?php

namespace App\Models;

use Spatie\Permission\Models\Role;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class FaqQuestionRole extends Model
{
    use HasFactory;

    protected $guarded = ['id'];

    public $timestamps = false;

    public function getRoleNameAttribute() {
       $name = '';

       $role = Role::find($this->role_id);
       if ($role) {
        $name = $role->name;
       }
       return $name;
    }
}
