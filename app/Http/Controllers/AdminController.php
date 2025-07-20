<?php

namespace App\Http\Controllers;
use App\Http\Requests\Auth\LoginRequest;
use App\Models\Customer;
use App\Models\Inventory;
use App\Models\Product;
use App\Models\ProductVariant;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Schema;


class AdminController extends Controller
{
    public function index()
    {
        $admins = User::all();
        return Inertia::render('admin/auth/login', [
            'admins' => $admins
        ]);
    }
    public function addAdmin()
    {
        // Only the head admin can access this page
        if (!auth()->user()->is_super) {
            abort(403, 'Only the head admin can manage other admins.');
        }

        $admins = User::where('is_admin', true)->get();
        return Inertia::render('admin/addAdmin', [
            'admins' => $admins,
            'is_super' => auth()->user()->is_super
        ]);
    }

    public function storeAdmin(Request $request)
    {
        $maxAdmins = 5;

        $adminCount = \App\Models\User::where('is_admin', true)->count();
        if ($adminCount >= $maxAdmins) {
            // Optionally use a redirect or validation error
            return back()->withErrors(['admin_limit' => 'Maximum admin count reached.']);
        }

        // Validate and create as usual
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8',
        ]);

        $admin = \App\Models\User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => bcrypt($request->password),
            'is_admin' => true,
        ]);
        return redirect()->route('admin.addAdmin')->with('success', 'Admin added!');
    }
    public function deleteAdmin($id)
{
    $admin = User::findOrFail($id);
    $admin->delete();

    // Return updated list of admins
    $admins = User::where('is_admin', true)->get();
    return Inertia::render('admin/addAdmin', [
        'admins' => $admins
    ]);
}
    public function dashboard()
    {
        return Inertia::render('admin/dashboard',[]);
    }

    public function login(LoginRequest $request): RedirectResponse
    {
        $request->authenticate();

        $request->session()->regenerate();

        return redirect()->intended(route('admin.dashboard', absolute: false));
    }

    public function storeImport(Request $request)
    {
        $request->validate([
            'shopify_csv' => 'required|file|mimes:csv,txt',
        ]);
        $category = $request->post('category');
        $path = $request->file('shopify_csv')->getRealPath();
        $data = array_map('str_getcsv', file($path));

        // Defensive: skip empty lines
        $data = array_filter($data, fn($row) => count($row) && array_filter($row));

        if (count($data) < 2) {
            return back()->with('error', 'CSV file seems empty or invalid.');
        }

        // Normalize headers to lowercase for consistent access
        $header = array_map(fn($h) => strtolower(trim($h)), $data[0]);
        unset($data[0]);
        function normalizeBoolean($value)
        {
            if (is_string($value)) {
                $value = strtolower(trim($value));
                if (in_array($value, ['true', '1', 'yes'])) return 1;
                if (in_array($value, ['false', '0', 'no'])) return 0;
            }
            if (is_numeric($value)) return ((int)$value) ? 1 : 0;
            return 0; // default to 0 if empty or unknown
        }

        $created = 0;
        // Required product fields
        if ($category == 'producten') {
            $requiredProduct = ['handle', 'title', 'body (html)'];
            $missingHeaders = array_diff($requiredProduct, $header);

            if (!empty($missingHeaders)) {
                return back()->with('error', 'Missing required product headers: ' . implode(', ', $missingHeaders));
            }

            foreach ($data as $row) {
                if (count($row) !== count($header)) continue; // skip malformed rows

                // Build associative array with lowercased keys
                $rowData = array_combine($header, $row);

                // Create Product
                $product = Product::create([
                    'handle' => $rowData['handle'] ?? '',
                    'title' => $rowData['title'] ?? '',
                    'body_html' => $rowData['body (html)'] ?? '',
                    'vendor' => $rowData['vendor'] ?? '',
                    'product_category' => $rowData['product_category'] ?? '',
                    'type' => $rowData['type'] ?? '',
                    'tags' => $rowData['tags'] ?? '',
                    'published' => normalizeBoolean($rowData['published'] ?? null),
                    'gift_card' => $rowData['gift_card'] ?? '',
                    'seo_title' => $rowData['seo_title'] ?? '',
                    'seo_description' => $rowData['seo_description'] ?? '',
                    'status' => $rowData['status'] ?? '',
                ]);

                // Create ProductVariant if SKU or price is present
                if (!empty($rowData['variant price'])) {
                    $product->variants()->create([
                        // CSV: Variant SKU
                        'sku' => $rowData['variant sku'] ?? '',
                        // CSV: Option1 Name, Option1 Value, Option1 Linked To
                        'option1_name' => $rowData['option1 name'] ?? '',
                        'option1_value' => $rowData['option1 value'] ?? '',
                        'option1_linked_to' => $rowData['option1 linked to'] ?? '',
                        // CSV: Option2 Name, Option2 Value, Option2 Linked To
                        'option2_name' => $rowData['option2 name'] ?? '',
                        'option2_value' => $rowData['option2 value'] ?? '',
                        'option2_linked_to' => $rowData['option2 linked to'] ?? '',
                        // CSV: Option3 Name, Option3 Value, Option3 Linked To
                        'option3_name' => $rowData['option3 name'] ?? '',
                        'option3_value' => $rowData['option3 value'] ?? '',
                        'option3_linked_to' => $rowData['option3 linked to'] ?? '',
                        // CSV: Variant Grams
                        'grams' => $rowData['variant grams'] ?? '',
                        // CSV: Variant Inventory Tracker
                        'inventory_tracker' => $rowData['variant inventory tracker'] ?? '',
                        // CSV: Variant Inventory Qty
                        'inventory_qty' => $rowData['variant inventory qty'] ?? '',
                        // CSV: Variant Inventory Policy
                        'inventory_policy' => $rowData['variant inventory policy'] ?? '',
                        // CSV: Variant Fulfillment Service
                        'fulfillment_service' => $rowData['variant fulfillment service'] ?? '',
                        // CSV: Variant Price
                        'price' => $rowData['variant price'] ?? '',
                        // CSV: Variant Compare At Price
                        'compare_at_price' => $rowData['variant compare at price'] ?? '',
                        // CSV: Variant Requires Shipping
                        'requires_shipping' => normalizeBoolean($rowData['variant requires shipping'] ?? ''),
                        // CSV: Variant Taxable
                        'taxable' => normalizeBoolean($rowData['variant taxable']) ?? '',
                        // CSV: Variant Barcode
                        'barcode' => $rowData['variant barcode'] ?? '',
                        // CSV: Variant Image
                        'variant_image' => $rowData['variant image'] ?? '',
                        // CSV: Variant Weight Unit
                        'weight_unit' => $rowData['variant weight unit'] ?? '',
                        // CSV: Variant Tax Code
                        'tax_code' => $rowData['variant tax code'] ?? '',
                        // CSV: Cost per item
                        'cost_per_item' => $rowData['cost per item'] ?? '',
                        // CSV: Google Shopping / Google Product Category
                        'google_product_category' => $rowData['google shopping / google product category'] ?? '',
                        // CSV: Google Shopping / Gender
                        'google_gender' => $rowData['google shopping / gender'] ?? '',
                        // CSV: Google Shopping / Age Group
                        'google_age_group' => $rowData['google shopping / age group'] ?? '',
                        // CSV: Google Shopping / MPN
                        'google_mpn' => $rowData['google shopping / mpn'] ?? '',
                        // CSV: Google Shopping / Condition
                        'google_condition' => $rowData['google shopping / condition'] ?? '',
                        // CSV: Google Shopping / Custom Product
                        'google_custom_product' => $rowData['google shopping / custom product'] ?? '',
                        // CSV: Google Shopping / Custom Label 0-4
                        'google_custom_label_0' => $rowData['google shopping / custom label 0'] ?? '',
                        'google_custom_label_1' => $rowData['google shopping / custom label 1'] ?? '',
                        'google_custom_label_2' => $rowData['google shopping / custom label 2'] ?? '',
                        'google_custom_label_3' => $rowData['google shopping / custom label 3'] ?? '',
                        'google_custom_label_4' => $rowData['google shopping / custom label 4'] ?? '',
                    ]);
                }

                // Attach image if present
                if (!empty($rowData['image_url'])) {
                    try {
                        $product
                            ->addMediaFromUrl($rowData['image_url'])
                            ->toMediaCollection('images');
                    } catch (\Exception $e) {
                        // You may want to log image errors, but don't fail the whole import
                    }
                }

                $created++;
            }
        }
        elseif ($category == 'klanten') {
            $requiredProduct = ['customer id'];
            $missingHeaders = array_diff($requiredProduct, $header);

            if (!empty($missingHeaders)) {
                return back()->with('error', 'Missing required klanten headers: ' . implode(', ', $missingHeaders));
            }
            foreach ($data as $row) {
                if (count($row) !== count($header)) continue; // skip malformed rows

                // Build associative array with lowercased keys
                $rowData = array_combine($header, $row);
                $customer = Customer::create([
                    'customer_id' => $rowData['customer id'] ?? null,
                    'first_name' => $rowData['first name'] ?? '',
                    'last_name' => $rowData['last name'] ?? '',
                    'email' => $rowData['email'] ?? '',
                    'accepts_email_marketing' => normalizeBoolean($rowData['accepts email marketing'] ?? null),
                    'default_address_company' => $rowData['default address company'] ?? '',
                    'default_address_address1' => $rowData['default address address1'] ?? '',
                    'default_address_address2' => $rowData['default address address2'] ?? '',
                    'default_address_address3' => $rowData['default address address3'] ?? '',
                    'default_address_city' => $rowData['default address city'] ?? '',
                    'default_address_province_code' => $rowData['default address province code'] ?? '',
                ]);
                $created++;
            }
        }
        elseif($category =='inventaris'){
            $requiredProduct = ['winkellocatie'];
            $missingHeaders = array_diff($requiredProduct, $header);
            if (!empty($missingHeaders)) {
                return back()->with('error', 'Missing required inventory ' . implode(', ', $missingHeaders));
            }
            foreach ($data as $row) {
                if (count($row) !== count($header)) continue;
                $rowData = array_combine($header, $row);
                $inventory = \App\Models\Inventory::create([
                    'handle'           => $rowData['handle'] ?? '',
                    'title'            => $rowData['title'] ?? '',
                    'option1_name'     => $rowData['option1 name'] ?? '',
                    'option1_value'    => $rowData['option1 value'] ?? '',
                    'option2_name'     => $rowData['option2 name'] ?? '',
                    'option2_value'    => $rowData['option2 value'] ?? '',
                    'option3_name'     => $rowData['option3 name'] ?? '',
                    'option3_value'    => $rowData['option3 value'] ?? '',
                    'sku'              => $rowData['sku'] ?? '',
                    'hs_code'          => $rowData['hs code'] ?? '',
                    'coo'              => $rowData['coo'] ?? '',
                    'inventory'    => $rowData['winkellocatie'] ?? '',
                ]);
                $created++;
            }
        }
        if ($created > 0) {
            return back()->with('success', "Imported {$created} products!");
        } else {
            return back()->with('error', 'No products were imported. Please check your CSV format.');
        }
    }
    public
        function import()
        {
            return Inertia::render('admin/import', [
                'csrfToken' => csrf_token(),
            ]);
        }

        public function manage(){
        return Inertia::render('admin/manage', [ 'is_super' => auth()->user()->is_super,
            'product' => Product::count(),
            'customer' => Customer::count(),
            'inventory' => Inventory::count(),
            'productData' => Product::with('variants')->get(),
            'inventoryData' => Inventory::all(),]);
        }
    public function editProduct($id)
    {
        $product = Product::with('variants')->findOrFail($id);

        // If using Inertia + React as frontend
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
            'published' => 'nullable|string',
            'gift_card' => 'nullable|string',
            'seo_title' => 'nullable|string',
            'seo_description' => 'nullable|string',
            'status' => 'nullable|string',
            'variants' => 'array',
            'variants.*.id' => 'required|integer|exists:product_variants,id',
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
        if ($request->isMethod('POST')) {
            $validated = $request->validate([
                'handle' => 'required|string|max:255',
                'title' => 'required|string|max:255',
                'body_html' => 'nullable|string',
                'vendor' => 'nullable|string',
                'product_category' => 'nullable|string',
                'type' => 'nullable|string',
                'tags' => 'nullable|string',
                'published' => 'nullable|string',
                'gift_card' => 'nullable|string',
                'seo_title' => 'nullable|string',
                'seo_description' => 'nullable|string',
                'status' => 'nullable|string',
                'variants' => 'array',
                'variants.*.id' => 'required|integer|exists:product_variants,id',
                'variants.*.sku' => 'nullable|string',
                'variants.*.option1_name' => 'nullable|string',
                'variants.*.option1_value' => 'nullable|string',
                'variants.*.option2_name' => 'nullable|string',
                'variants.*.option2_value' => 'nullable|string',
                'variants.*.option3_name' => 'nullable|string',
                'variants.*.option3_value' => 'nullable|string',
                'variants.*.price' => 'nullable|string',
            ]);
            Product::with('variants')->create([$validated]);
            return redirect()->route('admin.manage');

        }else return inertia::render('admin/addProduct', []);
    }
    }
