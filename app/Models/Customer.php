<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Customer extends Model
{
    use HasFactory;

    protected $fillable = [
        'customer_id',
        'first_name',
        'last_name',
        'email',
        'accepts_email_marketing',
        'default_address_company',
        'default_address_address1',
        'default_address_address2',
        'default_address_address3',
        'default_address_city',
        'default_address_province_code',
    ];

    protected $table = 'customers';
}
