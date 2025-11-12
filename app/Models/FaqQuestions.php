<?php

namespace App\Models;

use App\Models\CategoryFaq;
use App\Models\FaqQuestionRole;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class FaqQuestions extends Model
{
    use HasFactory;

    protected $guarded = ['id'];

    public function roles() {
        return $this->hasMany(FaqQuestionRole::class);
    }

    public function documents() {
        return $this->hasMany(FaqDocument::class, 'faq_id');
    }

    public function getCategoriaAttribute() {
        $categoria = CategoryFaq::find($this->category_id);
        if ($categoria === null)
            return '';
        $nome = $categoria->description;
        return $nome;
    }

    public function getCreatoreAttribute() {
        $creatore = User::find($this->creator);
        if ($creatore === null)
            return '';
        $fullname = $creatore->last_name . ' ' . $creatore->name;
        return $fullname;
    }

     //relazione "uno a uno" il modello corrente FaqQuestions e il modello CategoryFaq
     public function categoryFaq() {
        return $this->belongsTo(CategoryFaq::class, 'category_id');
    }

}
