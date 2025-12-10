<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;

class Customer extends Authenticatable
{
    protected $fillable = [
        'customer_id',
        'first_name',
        'last_name',
        'email',
        'password',
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
