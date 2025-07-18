<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

class Product extends Model implements HasMedia
{
    use HasFactory, InteractsWithMedia;

    protected $fillable = [
        'handle',
        'title',
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
