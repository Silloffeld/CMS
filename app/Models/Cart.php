<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Cart extends Model
{
    protected $casts = [
        'options' => 'array',
    ];

    protected $table = 'carts';

    protected $fillable = [
        'user_id',
        'product_id',
        'product_name',
        'options',
        'price',
    ];
}
