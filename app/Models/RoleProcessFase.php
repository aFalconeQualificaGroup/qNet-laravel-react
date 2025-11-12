<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RoleProcessFase extends Model
{
    use HasFactory;

    protected $guarded = ['id'];

    public function roleprocessesfasesactivities()
    {
        return $this->hasMany(RoleProcessFaseActivity::class, 'process_id', 'process_id')->orderBy('nr_activity');
    }

    public function roleprocessesfasesactivitiesdocs()
    {
        return $this->hasManyThrough(RoleProcessFaseActivity::class, RoleProcessFaseActivityDoc::class, 'process_id', 'process_id','nr_fase','nr_fase','nr_activity','nr_activity');
    }

    public function processesfasesactivitydocs()
    {
        return $this->hasMany(RoleProcessFaseActivityDoc::class, 'process_id', 'process_id');
    }
}
