<?php

namespace App\Models;

use App\Models\Rate;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

class Product extends Model
{
    use HasFactory, LogsActivity;

    protected $guarded = [
        'id'
    ];

     /**
     * The attribute for Log Activity
     */
    protected static $logUnguarded = true;
    protected static $ignoreChangedAttributes = ['updated_at'];
    protected static $logAttributesToIgnore = [ 'updated_at'];
    protected static $logName = 'Prodotti';
    protected static $logOnlyDirty = true;

    public function getActivitylogOptions(): LogOptions
    {
        $logOptions = new LogOptions;
        $logOptions->logFillable();
        $logOptions->logOnlyDirty();

        return $logOptions;
    }

    public function getShortrateAttribute() {
        $shortdesc =  '';
        $rate = Rate::find($this->rate_id);
        if ($rate) {
            $shortdesc =  $rate->shortdesc;
        }
        return $shortdesc;
    }

    public function getStockProductAttribute() {
        $sum = StockAvailable::where('product_id', $this->id)
            ->sum('stock_availables.amount');
        return $sum;
    }

    public function getCategoriaAttribute() {
        $categoria =  '';
        $category = Category::find($this->category_id);
        if ($category) {
            $categoria =  $category->description;
        }
        return $categoria;
    }

    public function getFornitoreAttribute() {
        $fornitore =  '';
        $supplier = Company::find($this->supplier_id);
        if ($supplier) {
            $fornitore =  $supplier->name;
        }
        return $fornitore;
    }

}
