<?php

namespace App\Models;

use App\Notifications\CustomPasswordResetNotification;
use Illuminate\Notifications\Notifiable;
use Illuminate\Foundation\Auth\User as Authenticatable;

class Customer extends Authenticatable
{
    use Notifiable;

    protected $guard = 'customer';
    protected $table = 'companies';

    protected $fillable = [
        'name', 'email', 'password',
    ];

    protected $hidden = [
        'password', 'remember_token',
    ];

    public function sendPasswordResetNotification($token)  {
        $this->notify(new CustomPasswordResetNotification($token));
    }

    public function getProvinciaAttribute() {
        $provincia = Provincies::find($this->province_id);
        if ($provincia) {
            return $provincia->provincia;
        }
        return '';
    }
}
