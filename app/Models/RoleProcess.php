<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RoleProcess extends Model
{
    use HasFactory;

    protected $guarded = ['id'];

    public function roleprocessesdocs()
    {
        return $this->hasMany(RoleProcessDoc::class, 'role_id', 'role_id');
    }

    public function roleprocessesfasesprofile()
    {
        return $this->hasMany(RoleProcessFase::class, 'role_id', 'role_id');
    }

    public function roleprocessesfases()
    {
        return $this->hasManyThrough(RoleProcessFaseActivity::class, RoleProcessFase::class, 'process_id', 'process_id','nr_fase','nr_fase');
    }

    public function roleprocessesfasesdocs()
    {
        return $this->hasMany(RoleProcessFaseDoc::class, 'role_id', 'role_id');
    }

    public function roleprocessesfasesactivities()
    {
        return $this->hasMany(RoleProcessFaseActivity::class, 'role_id', 'role_id');
    }

    public function roleprocessesfasesactivitiesdocs()
    {
        return $this->hasMany(RoleProcessFaseActivityDoc::class, 'process_id', 'id');
    }

    public function processesfases()
    {
        return $this->hasMany(RoleProcessFase::class, 'process_id', 'id')->orderBy('nr_fase');
    }

    public function processesfasesdocs()
    {
        return $this->hasMany(RoleProcessFaseDoc::class, 'process_id', 'id');
    }

    public function processesfasesactivities()
    {
        return $this->hasMany(RoleProcessFaseActivity::class, 'process_id', 'id');
    }

    public function processesfasesactivitydocs()
    {
        return $this->hasMany(RoleProcessFaseActivityDoc::class, 'process_id', 'id');
    }


}
