<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        // Products Table
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('handle')->index();
            $table->string('title')->nullable();
            $table->text('body_html')->nullable();
            $table->string('vendor')->nullable();
            $table->string('product_category')->nullable();
            $table->string('type')->nullable();
            $table->string('tags')->nullable();
            $table->boolean('published')->default(true);
            $table->string('gift_card')->nullable();
            $table->string('seo_title')->nullable();
            $table->text('seo_description')->nullable();
            $table->string('status')->nullable();
            $table->timestamps();
        });

        // Product Variants Table
        Schema::create('product_variants', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained('products')->onDelete('cascade');
            // Option Columns
            $table->string('option1_name')->nullable();
            $table->string('option1_value')->nullable();
            $table->string('option2_name')->nullable();
            $table->string('option2_value')->nullable();
            $table->string('option3_name')->nullable();
            $table->string('option3_value')->nullable();
            // Variant info
            $table->string('sku')->nullable();
            $table->float('grams')->nullable();
            $table->string('inventory_tracker')->nullable();
            $table->integer('inventory_qty')->nullable();
            $table->string('inventory_policy')->nullable();
            $table->string('fulfillment_service')->nullable();
            $table->decimal('price', 10, 2)->nullable();
            $table->decimal('compare_at_price', 10, 2)->nullable();
            $table->boolean('requires_shipping')->nullable();
            $table->boolean('taxable')->nullable();
            $table->string('barcode')->nullable();
            $table->string('weight_unit')->nullable();
            $table->string('tax_code')->nullable();
            $table->decimal('cost_per_item', 10, 2)->nullable();
            // Google Shopping
            $table->string('google_product_category')->nullable();
            $table->string('google_gender')->nullable();
            $table->string('google_age_group')->nullable();
            $table->string('google_mpn')->nullable();
            $table->string('google_condition')->nullable();
            $table->string('google_custom_product')->nullable();
            $table->string('google_custom_label_0')->nullable();
            $table->string('google_custom_label_1')->nullable();
            $table->string('google_custom_label_2')->nullable();
            $table->string('google_custom_label_3')->nullable();
            $table->string('google_custom_label_4')->nullable();
            $table->timestamps();
        });

        // Spatie Media Library creates its own 'media' table via its migration.
    }

    public function down(): void
    {
        Schema::dropIfExists('product_variants');
        Schema::dropIfExists('products');
    }
};
