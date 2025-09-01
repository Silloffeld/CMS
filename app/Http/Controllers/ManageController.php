<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\Inventory;
use App\Models\Media;
use App\Models\Product;
use App\Models\ProductVariant;
use Illuminate\Http\Request;
use Illuminate\Routing\Route;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ManageController extends Controller
{
    public function manage(){
        return Inertia::render('admin/manage', [ 'is_super' => auth()->user()->is_super,
            'product' => Product::count(),
            'customer' => Customer::count(),
            'productData' => Product::with('variants')->get(),
            'inventoryData' => ProductVariant::with('product')->get()]);
    }
    public function deleteManage(Request $request)
    {
        $id = $request->input('id');
        $title = $request->input('title');
        Product::findOrFail($id)->delete();
        return back()->with('success', $title . ' deleted!');
    }
    public function editProduct($id)
    {
        $product = Product::with('variants')->findOrFail($id);

        return inertia('admin/editProduct', [
            'product' => $product,
        ]);
    }

    public function updateProduct(Request $request, $product)
    {
        // 1. Validate the main product fields and variants array
        $validated = $request->validate([
            'handle' => 'required|string|max:255',
            'title' => 'required|string|max:255',
            'body_html' => 'nullable|string',
            'vendor' => 'nullable|string',
            'product_category' => 'nullable|string',
            'type' => 'nullable|string',
            'tags' => 'nullable|string',
            'published' => 'nullable|integer',
            'gift_card' => 'nullable|string',
            'seo_title' => 'nullable|string',
            'seo_description' => 'nullable|string',
            'status' => 'nullable|string',
            'variants' => 'array',
            'variants.*.id' => 'integer|exists:product_variants,id',
            'variants.*.sku' => 'nullable|string',
            'variants.*.option1_name' => 'nullable|string',
            'variants.*.option1_value' => 'nullable|string',
            'variants.*.option2_name' => 'nullable|string',
            'variants.*.option2_value' => 'nullable|string',
            'variants.*.option3_name' => 'nullable|string',
            'variants.*.option3_value' => 'nullable|string',
            'variants.*.price' => 'nullable|string',
        ]);

        // 2. Update the product
        $product = Product::findOrFail($product);
        $product->update([
            'handle' => $validated['handle'],
            'title' => $validated['title'],
            'body_html' => $validated['body_html'] ?? null,
            'vendor' => $validated['vendor'] ?? null,
            'product_category' => $validated['product_category'] ?? null,
            'type' => $validated['type'] ?? null,
            'tags' => $validated['tags'] ?? null,
            'published' => $validated['published'] ?? null,
            'gift_card' => $validated['gift_card'] ?? null,
            'seo_title' => $validated['seo_title'] ?? null,
            'seo_description' => $validated['seo_description'] ?? null,
            'status' => $validated['status'] ?? null,
        ]);

        // 3. Update each variant
        if (isset($validated['variants'])) {
            foreach ($validated['variants'] as $variantData) {
                $variant = ProductVariant::findOrFail($variantData['id']);
                $variant->update([
                    'sku' => $variantData['sku'] ?? null,
                    'option1_name' => $variantData['option1_name'] ?? null,
                    'option1_value' => $variantData['option1_value'] ?? null,
                    'option2_name' => $variantData['option2_name'] ?? null,
                    'option2_value' => $variantData['option2_value'] ?? null,
                    'option3_name' => $variantData['option3_name'] ?? null,
                    'option3_value' => $variantData['option3_value'] ?? null,
                    'price' => $variantData['price'] ?? null,
                ]);
            }
        }

        // 4. Redirect back (or return response)
        return redirect()->route('admin.editProduct', $product->id)
            ->with('success', 'Product and variants updated.');
    }

    public function addProduct(Request $request){
            return inertia::render('admin/addProduct', []);
    }
    public function storeProduct(Request $request)
    {
        $validated = $request->validate([
            'handle' => 'required|string|max:255',
            'title' => 'required|string|max:255',
            'body_html' => 'nullable|string',
            'vendor' => 'nullable|string',
            'product_category' => 'nullable|string',
            'type' => 'nullable|string',
            'tags' => 'nullable|string',
            'gift_card' => 'nullable|string',
            'seo_title' => 'nullable|string',
            'seo_description' => 'nullable|string',
            'status' => 'nullable|string',
            'variants' => 'array',
            'variants.*.variantName' => 'nullable|string',
            'variants.*.options' => 'array',
            'variants.*.price' => 'nullable|string',
            'images' => 'required|array',
            'images.*' => 'image|mimes:jpeg,png,jpg,gif,svg,webp|max:2048',
            'variantChosen' => 'array',
            'variantChosen.*' => 'string',
        ]);

        $optionArrays = [];
        foreach ($validated['variants'] as $variant) {
            $optionValues = [];
            foreach ($variant['options'] as $option) {
                if (!empty($option['name'])) {
                    $optionValues[] = $option['name'];
                }
            }
            if (!empty($optionValues)) {
                $optionArrays[] = $optionValues;
            }
        }

        $result = [[]];
        foreach ($optionArrays as $array) {
            $tmp = [];
            foreach ($result as $product) {
                foreach ($array as $value) {
                    $tmp[] = array_merge($product, [$value]);
                }
            }
            $result = $tmp;
        }

        $optionNames = array_map(function($variant) {
            return $variant['variantName'];
        }, $validated['variants']);

        $combinations = [];
        foreach ($result as $combo) {
            $assoc = [];
            foreach ($optionNames as $i => $name) {
                $assoc[$name] = $combo[$i];
            }
            $combinations[] = $assoc;
        }

        $product = Product::create($validated);

        foreach ($combinations as $combo) {
            $product->variants()->create([
                'options' => json_encode($combo),
            ]);
        }

        // --- Save images ---
        foreach ($request->file('images', []) as $i => $file) {
            $path = $file->store('products', 'public');
            Media::create([
                'path' => Storage::disk('public')->url($path),
                'product_id' => $product->id,
                'variant' => $validated['variantChosen'][$i] ?? '',
            ]);
        }


        return redirect()->route('admin.manage');
}







}
