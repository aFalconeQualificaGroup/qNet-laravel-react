<?php

namespace App\Models;

use Spatie\EloquentSortable\Sortable;
use Illuminate\Database\Eloquent\Model;
use Spatie\EloquentSortable\SortableTrait;
use Spatie\MediaLibrary\InteractsWithMedia;

class BoardTask extends Model implements Sortable
{
    use SortableTrait;

    public $sortable = [
        'order_column_name' => 'order_column',
        'sort_when_creating' => true,
    ];

    protected $fillable = [
        'name',
        'description',
        'label',
        'due_date',
        'order_column',
        'finished',
        'group_id',
    ];

    protected $casts = [
        'due_date' => 'datetime:Y-m-d',
    ];

    public function members()
    {
        return $this->belongsToMany(User::class, 'board_task_members', 'task_id');
    }

    public function labels()
    {
        return $this->hasMany(BoardTaskLabel::class);
    }
}
