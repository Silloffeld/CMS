<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCartsTable extends Migration
{
    public function up()
    {
        Schema::create('carts', function (Blueprint $table) {
            $table->id();

            $table->foreignId('user_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->foreignId('product_variant_id')
                ->constrained('product_variants')
                ->cascadeOnDelete();

            $table->string('product_name');
            $table->integer('price');
            $table->foreign('product_name')
                ->references('name')
                ->on('products')
                ->cascadeOnDelete();

            $table->foreign('price')
                ->references('price')
                ->on('product_variants')
                ->cascadeOnDelete();

            $table->json('options')->nullable();

            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('carts');
    }
}
