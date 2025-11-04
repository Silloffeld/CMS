<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\ProductVariant;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Sample Product 1: T-Shirt
        $tshirt = Product::create([
            'handle' => 'classic-t-shirt',
            'title' => 'Classic T-Shirt',
            'body_html' => '<p>A comfortable and stylish classic t-shirt made from 100% cotton.</p>',
            'vendor' => 'Fashion Co.',
            'product_category' => 'Clothing',
            'type' => 'Shirt',
            'tags' => 'casual, cotton, comfortable',
            'published' => true,
            'status' => 'active',
        ]);

        // Create variants for different sizes and colors
        $sizes = ['S', 'M', 'L', 'XL'];
        $colors = ['Red', 'Blue', 'Black', 'White'];
        
        foreach ($colors as $color) {
            foreach ($sizes as $size) {
                ProductVariant::create([
                    'product_id' => $tshirt->id,
                    'options' => json_encode(['Color' => $color, 'Size' => $size]),
                    'sku' => 'TSHIRT-' . strtoupper($color) . '-' . $size,
                    'price' => 29.99,
                    'compare_at_price' => 39.99,
                    'inventory_qty' => rand(10, 50),
                    'inventory_policy' => 'deny',
                    'requires_shipping' => true,
                    'taxable' => true,
                ]);
            }
        }

        // Sample Product 2: Jeans
        $jeans = Product::create([
            'handle' => 'slim-fit-jeans',
            'title' => 'Slim Fit Jeans',
            'body_html' => '<p>Modern slim fit jeans with stretch denim for comfort and style.</p>',
            'vendor' => 'Denim Works',
            'product_category' => 'Clothing',
            'type' => 'Pants',
            'tags' => 'denim, casual, modern',
            'published' => true,
            'status' => 'active',
        ]);

        $jeansSizes = ['28', '30', '32', '34', '36'];
        $jeansColors = ['Dark Blue', 'Light Blue', 'Black'];
        
        foreach ($jeansColors as $color) {
            foreach ($jeansSizes as $size) {
                ProductVariant::create([
                    'product_id' => $jeans->id,
                    'options' => json_encode(['Color' => $color, 'Waist' => $size]),
                    'sku' => 'JEANS-' . str_replace(' ', '', strtoupper($color)) . '-' . $size,
                    'price' => 79.99,
                    'compare_at_price' => 99.99,
                    'inventory_qty' => rand(5, 30),
                    'inventory_policy' => 'deny',
                    'requires_shipping' => true,
                    'taxable' => true,
                ]);
            }
        }

        // Sample Product 3: Sneakers
        $sneakers = Product::create([
            'handle' => 'running-sneakers',
            'title' => 'Running Sneakers',
            'body_html' => '<p>Lightweight running sneakers with excellent cushioning and support.</p>',
            'vendor' => 'Sport Gear',
            'product_category' => 'Footwear',
            'type' => 'Shoes',
            'tags' => 'sports, running, comfortable',
            'published' => true,
            'status' => 'active',
        ]);

        $shoeSizes = ['7', '8', '9', '10', '11', '12'];
        $shoeColors = ['Black', 'White', 'Grey'];
        
        foreach ($shoeColors as $color) {
            foreach ($shoeSizes as $size) {
                ProductVariant::create([
                    'product_id' => $sneakers->id,
                    'options' => json_encode(['Color' => $color, 'Size' => $size]),
                    'sku' => 'SNEAKER-' . strtoupper($color) . '-' . $size,
                    'price' => 89.99,
                    'compare_at_price' => 119.99,
                    'inventory_qty' => rand(8, 25),
                    'inventory_policy' => 'deny',
                    'requires_shipping' => true,
                    'taxable' => true,
                ]);
            }
        }

        // Sample Product 4: Backpack
        $backpack = Product::create([
            'handle' => 'travel-backpack',
            'title' => 'Travel Backpack',
            'body_html' => '<p>Durable travel backpack with multiple compartments and laptop sleeve.</p>',
            'vendor' => 'Travel Gear Co.',
            'product_category' => 'Accessories',
            'type' => 'Bag',
            'tags' => 'travel, backpack, durable',
            'published' => true,
            'status' => 'active',
        ]);

        $backpackColors = ['Black', 'Navy', 'Grey', 'Olive'];
        
        foreach ($backpackColors as $color) {
            ProductVariant::create([
                'product_id' => $backpack->id,
                'options' => json_encode(['Color' => $color]),
                'sku' => 'BACKPACK-' . strtoupper($color),
                'price' => 59.99,
                'compare_at_price' => 79.99,
                'inventory_qty' => rand(15, 40),
                'inventory_policy' => 'deny',
                'requires_shipping' => true,
                'taxable' => true,
            ]);
        }
    }
}
