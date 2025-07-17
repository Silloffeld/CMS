<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ProductVariant extends Model
{
    use HasFactory;

    protected $fillable = [
        'product_id',
        'option1_name', 'option1_value',
        'option2_name', 'option2_value',
        'option3_name', 'option3_value',
        'sku', 'grams', 'inventory_tracker', 'inventory_qty',
        'inventory_policy', 'fulfillment_service', 'price', 'compare_at_price',
        'requires_shipping', 'taxable', 'barcode', 'weight_unit', 'tax_code', 'cost_per_item',
        'google_product_category', 'google_gender', 'google_age_group', 'google_mpn',
        'google_condition', 'google_custom_product',
        'google_custom_label_0', 'google_custom_label_1', 'google_custom_label_2',
        'google_custom_label_3', 'google_custom_label_4'
    ];
    protected $table = 'product_variants';
    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
