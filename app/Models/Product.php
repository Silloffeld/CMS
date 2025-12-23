<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = [
        'handle',
        'title',
        'primary_option',
        'body_html',
        'vendor',
        'product_category',
        'type',
        'tags',
        'published',
        'gift_card',
        'seo_title',
        'seo_description',
        'status',
    ];

    public function variants()
    {
        return $this->hasMany(ProductVariant::class);
    }
}
