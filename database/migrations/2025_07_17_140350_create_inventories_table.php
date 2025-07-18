<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateInventoriesTable extends Migration
{
    public function up()
    {
        Schema::create('inventories', function (Blueprint $table) {
            $table->id();
            $table->string('handle')->nullable();           // Product handle
            $table->string('title')->nullable();            // Product title
            $table->string('option1_name')->nullable();      // First option name (e.g. color)
            $table->string('option1_value')->nullable();     // First option value
            $table->string('option2_name')->nullable();      // Second option name
            $table->string('option2_value')->nullable();     // Second option value
            $table->string('option3_name')->nullable();      // Third option name
            $table->string('option3_value')->nullable();     // Third option value
            $table->string('sku')->nullable();               // SKU
            $table->string('hs_code')->nullable();           // HS Code
            $table->string('coo')->nullable();               // Country of Origin (COO)
            $table->integer('inventory')->nullable();     // Store location (Winkellocatie)
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('inventories');
    }
}
