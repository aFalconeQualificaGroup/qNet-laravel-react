<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\EmailFolder;

class EmailDownload extends Model
{
    use HasFactory;

    protected $fillable = [
        'from',
        'to',
        'subject',
        'message',
        'receveid_at',
        'seen',
        'email_id',
        'category_id',
        'user_id',
        'folder_id',
        'attachments_id',
        'reply_to',
        'parent_id',
        'guests',
        'downloaded_at',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        'guests' => 'array',
    ];

    public function category()
    {
        return $this->belongsTo(EmailCategory::class, 'category_id');
    }

    public function folder()
    {
        return $this->belongsTo(EmailFolder::class, 'folder_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function attachments()
    {
        return $this->hasMany(EmailAttachment::class, 'email_id');
    }


}
