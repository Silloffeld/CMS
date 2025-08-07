<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Media extends Model
{
    protected $fillable = [
        'variant',
        'path',
        'product_id',
    ];

    public function product(){
        return $this->belongsTo(Product::class);
    }
}
