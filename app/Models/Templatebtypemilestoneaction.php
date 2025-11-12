<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Templatebtypemilestoneaction extends Model
{
    use HasFactory;

    protected $guarded = [
        'id'
    ];

    public function templatemilestonedocuments() {
        return $this->hasMany(TemplatebtypemilestoneactionDocument::class);
    }

    public function subtasks() {
        return $this->hasMany(Templatebtypemilestoneaction::class, 'parent_id', 'id');
    }

    public function getTypeAttribute() {
        switch ($this->typetask) {
            case 'T':
                return "Task";
                break;
            case 'I':
                return "Incontro";
                break;
            case 'C':
                return "Chiamata";
                break;
            case 'O':
                return "Intervento";
                break;
        }
    }

    public function getUserAttribute() {
        $user = User::find($this->assigned_to);
        if ($user) {
            return $user->name . ' ' . $user->last_name;
        }
        return '';
    }

    public function getAllegatoAttribute() {
        if ($this->description != "") {
            return 'Si';
        }
        return 'No';
    }
}
