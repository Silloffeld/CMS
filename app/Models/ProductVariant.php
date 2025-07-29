<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ProductVariant extends Model
{
    use HasFactory;

    protected $fillable = [
        'product_id',
        'options',
        'sku', 'grams', 'inventory_tracker', 'inventory_qty',
        'inventory_policy', 'fulfillment_service', 'price', 'compare_at_price',
        'requires_shipping', 'taxable', 'barcode', 'weight_unit', 'tax_code', 'cost_per_item',
    ];
    protected $table = 'product_variants';
    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
