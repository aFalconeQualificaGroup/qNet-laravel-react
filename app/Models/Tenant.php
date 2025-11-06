<?php

namespace App\Models;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Tenant extends Model
{
    use HasFactory;

    /**
     * The connection name for the model.
     *
     * @var string|null
     */
    protected $connection = 'landlord';

    protected $guarded = [];

    /**
     * Configure the tenant database connection
     */
    public function configure()
    {
        config([
            'database.connections.tenant.database' => $this->database,
            'cache.prefix' => $this->id
        ]);

        DB::purge('tenant');

        app('cache')->purge(
            config('cache.default')
        );

        return $this;
    }

    /**
     * Make this tenant the current tenant
     */
    public function use()
    {
        app()->forgetInstance('tenant');

        app()->instance('tenant', $this);

        return $this;
    }
}
