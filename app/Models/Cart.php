<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Cart extends Model
{
    protected $casts = [
        'options' => 'array',
    ];
    protected $table = 'cart';
    protected $fillable = [
        'customer_id',
        'product_id',
        'options',
        'quantity',
    ];
    public $timestamps = false;

    public function product()
    {
        return $this->belongsTo(ProductVariant::class, 'product_id');
    }

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }
}
