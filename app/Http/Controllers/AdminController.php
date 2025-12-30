<?php

namespace App\Http\Controllers;
use App\Http\Requests\Auth\LoginRequest;
use App\Models\Customer;
use App\Models\Inventory;
use App\Models\Product;
use App\Models\ProductVariant;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Schema;


class AdminController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json([
            'message' => 'Admin login page',
        ]);
    }

    public function addAdmin(): JsonResponse
    {
        // Only the head admin can access this page
        if (!Auth::guard('admin')->user()->is_super) {
            return response()->json([
                'error' => 'Only the head admin can manage other admins.',
            ], 403);
        }

        $admins = User::where('is_admin', true)->get();
        return response()->json([
            'admins' => $admins,
            'is_super' => Auth::guard('admin')->user()->is_super,
        ]);
    }

    public function storeAdmin(Request $request): JsonResponse
    {
        $maxAdmins = 5;

        $adminCount = \App\Models\User::where('is_admin', true)->count();
        if ($adminCount >= $maxAdmins) {
            return response()->json([
                'error' => 'Maximum admin count reached.',
            ], 422);
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

        return response()->json([
            'message' => 'Admin added!',
            'admin' => $admin,
        ]);
    }

    public function deleteAdmin($id): JsonResponse
    {
        $admin = User::findOrFail($id);
        $admin->delete();

        // Return updated list of admins
        $admins = User::where('is_admin', true)->get();
        return response()->json([
            'message' => 'Admin deleted',
            'admins' => $admins,
        ]);
    }

    public function dashboard(): JsonResponse
    {
        return response()->json([
            'user' => Auth::user(),
        ]);
    }

    public function login(LoginRequest $request): JsonResponse
    {
        if (Auth::guard('admin')->attempt($request->only('email', 'password'))) {
            return response()->json([
                'message' => 'Authenticated successfully',
                'redirect' => route('admin.dashboard'),
            ]);
        }

        return response()->json([
            'error' => 'Invalid credentials',
        ], 401);
    }


    public function storeImport(Request $request): JsonResponse
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
            return response()->json([
                'error' => 'CSV file seems empty or invalid.',
            ], 422);
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
                return response()->json([
                    'error' => 'Missing required product headers: ' . implode(', ', $missingHeaders),
                ], 422);
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
                return response()->json([
                    'error' => 'Missing required klanten headers: ' . implode(', ', $missingHeaders),
                ], 422);
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
//        elseif($category =='inventaris'){
//            $requiredProduct = ['location'];
//            $missingHeaders = array_diff($requiredProduct, $header);
//            if (!empty($missingHeaders)) {
//                return back()->with('error', 'Missing required inventory ' . implode(', ', $missingHeaders));
//            }
//            //TODO:: fix inventory import if necissary
//            foreach ($data as $row) {
//                if (count($row) !== count($header)) continue;
//                $rowData = array_combine($header, $row);
//                $inventory = Inventory::create([
//                    'handle'           => $rowData['handle'] ?? '',
//                    'title'            => $rowData['title'] ?? '',
//                    'option1_name'     => $rowData['option1 name'] ?? '',
//                    'option1_value'    => $rowData['option1 value'] ?? '',
//                    'option2_name'     => $rowData['option2 name'] ?? '',
//                    'option2_value'    => $rowData['option2 value'] ?? '',
//                    'option3_name'     => $rowData['option3 name'] ?? '',
//                    'option3_value'    => $rowData['option3 value'] ?? '',
//                    'sku'              => $rowData['sku'] ?? '',
//                    'hs_code'          => $rowData['hs code'] ?? '',
//                    'coo'              => $rowData['coo'] ?? '',
//                    'inventory'    => $rowData['location'] ?? '',
//                ]);
//                $created++;
//            }
//        }
        if ($created > 0) {
            return response()->json([
                'message' => "Imported {$created} products!",
            ]);
        } else {
            return response()->json([
                'error' => 'No products were imported. Please check your CSV format.',
            ], 422);
        }
    }

    public function import(): JsonResponse
    {
        return response()->json([
            'csrfToken' => csrf_token(),
        ]);
    }

    }
