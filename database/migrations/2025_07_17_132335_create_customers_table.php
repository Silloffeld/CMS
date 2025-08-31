<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCustomersTable extends Migration
{
    public function up()
    {
        Schema::create('customers', function (Blueprint $table) {
            $table->id(); // Laravel's auto-increment PK
            $table->bigInteger('customer_id')->nullable(); // Customer ID from Shopify
            $table->string('first_name')->nullable();
            $table->string('last_name')->nullable();
            $table->string('email');
            $table->boolean('accepts_email_marketing')->default(false)->nullable();
            $table->string('default_address_company')->nullable();
            $table->string('default_address_address1')->nullable();
            $table->string('default_address_address2')->nullable();
            $table->string('default_address_address3')->nullable();
            $table->string('default_address_city')->nullable();
            $table->string('default_address_province_code')->nullable();
            $table->string('password');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('customers');
    }
}
