<?php

namespace App\Http\Controllers;

use App\Http\Requests\Auth\LoginRequest;
use App\Models\Cart;
use App\Models\Customer;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\ProductVariant;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ShopController extends Controller
{
    public function login(){
        return Inertia::render('Shop/login');
    }
    public function register(){
        return Inertia::render('Shop/register');
    }
    public function account(){
       $user = Auth::guard('web')->user();
        return Inertia::render('Shop/account' , [ 'user' => $user ]);
    }
    public function authenticate(LoginRequest $request): RedirectResponse
    {
        if (Auth::guard('web')->attempt($request->only('email', 'password'))) {
            $request->session()->regenerate();
            return redirect()->intended(route('shop.account', absolute: false));
        }
        else return back()->with('error', 'Invalid email or password.');
    }
    public function storeAccount(request $request){
        $creds = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:customers',
            'password' => 'required|string|min:6|confirmed',
            'password_confirmation' => 'required|string|min:6',
        ]);
        if(!$creds['password'] === $creds['password_confirmation']){
            return back()->with('error', 'Password does not match.');
        }else {
            Customer::create(['email' => $creds['email'], 'password' => bcrypt($creds['password'])]);
            return Inertia::render('Shop/login');}
    }

    public function cart(){
        $user = Auth::guard('web')->user();
        $cartItems = Cart::where('customer_id', $user->id)
            ->with(['product' => function($query) {
                $query->select('id', 'product_id', 'price', 'options');
            }])
            ->get();
        
        return Inertia::render('Shop/cart', ['cart' => $cartItems]);
    }
    
    public function addToCart(Request $request) {
        $user = Auth::guard('web')->user();
        
        $validated = $request->validate([
            'product_id' => 'required|exists:product_variants,id',
            'quantity' => 'required|integer|min:1',
        ]);
        
        $existing = Cart::where('customer_id', $user->id)
            ->where('product_id', $validated['product_id'])
            ->first();
            
        if ($existing) {
            $existing->quantity += $validated['quantity'];
            $existing->save();
        } else {
            Cart::create([
                'customer_id' => $user->id,
                'product_id' => $validated['product_id'],
                'quantity' => $validated['quantity'],
            ]);
        }
        
        return back()->with('success', 'Product added to cart');
    }
    
    public function updateCartItem(Request $request, $id) {
        $user = Auth::guard('web')->user();
        
        $validated = $request->validate([
            'quantity' => 'required|integer|min:1',
        ]);
        
        $cartItem = Cart::where('id', $id)
            ->where('customer_id', $user->id)
            ->firstOrFail();
            
        $cartItem->quantity = $validated['quantity'];
        $cartItem->save();
        
        return back()->with('success', 'Cart updated');
    }
    
    public function removeFromCart($id) {
        $user = Auth::guard('web')->user();
        
        Cart::where('id', $id)
            ->where('customer_id', $user->id)
            ->delete();
            
        return back()->with('success', 'Item removed from cart');
    }
    public function showProducts() {
        $products = Product::with('variants')->where('published', true)->get();

        return Inertia::render('Shop/Products', [
            'products' => $products,
        ]);
    }
    
    public function updateAccount(Request $request) {
        $user = Auth::guard('web')->user();
        
        $validated = $request->validate([
            'first_name' => 'nullable|string|max:255',
            'last_name' => 'nullable|string|max:255',
            'email' => 'required|string|email|max:255|unique:customers,email,' . $user->id,
            'password' => 'nullable|string|min:6|confirmed',
        ]);
        
        $updateData = [
            'first_name' => $validated['first_name'] ?? $user->first_name,
            'last_name' => $validated['last_name'] ?? $user->last_name,
            'email' => $validated['email'],
        ];
        
        if (!empty($validated['password'])) {
            $updateData['password'] = bcrypt($validated['password']);
        }
        
        $user->update($updateData);
        
        return back()->with('success', 'Account updated successfully');
    }
    
    public function checkout() {
        $user = Auth::guard('web')->user();
        $cartItems = Cart::where('customer_id', $user->id)
            ->with('product')
            ->get();
            
        if ($cartItems->isEmpty()) {
            return redirect()->route('shop.cart')->with('error', 'Your cart is empty');
        }
        
        return Inertia::render('Shop/checkout', [
            'cartItems' => $cartItems,
            'user' => $user,
        ]);
    }
    
    public function processCheckout(Request $request) {
        $user = Auth::guard('web')->user();
        
        $validated = $request->validate([
            'shipping_address' => 'required|string',
            'billing_address' => 'nullable|string',
            'notes' => 'nullable|string',
        ]);
        
        $cartItems = Cart::where('customer_id', $user->id)
            ->with('product')
            ->get();
            
        if ($cartItems->isEmpty()) {
            return redirect()->route('shop.cart')->with('error', 'Your cart is empty');
        }
        
        $total = 0;
        foreach ($cartItems as $item) {
            $total += $item->product->price * $item->quantity;
        }
        
        DB::beginTransaction();
        try {
            $order = Order::create([
                'customer_id' => $user->id,
                'status' => 'pending',
                'total' => $total,
                'shipping_address' => $validated['shipping_address'],
                'billing_address' => $validated['billing_address'] ?? $validated['shipping_address'],
                'notes' => $validated['notes'] ?? null,
            ]);
            
            foreach ($cartItems as $item) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_variant_id' => $item->product_id,
                    'quantity' => $item->quantity,
                    'price' => $item->product->price,
                    'options' => $item->product->options,
                ]);
            }
            
            Cart::where('customer_id', $user->id)->delete();
            
            DB::commit();
            
            return redirect()->route('shop.order.confirmation', $order->id)
                ->with('success', 'Order placed successfully');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Failed to process order: ' . $e->getMessage());
        }
    }
    
    public function orderConfirmation($orderId) {
        $user = Auth::guard('web')->user();
        $order = Order::with('items.productVariant.product')
            ->where('id', $orderId)
            ->where('customer_id', $user->id)
            ->firstOrFail();
            
        return Inertia::render('Shop/OrderConfirmation', [
            'order' => $order,
        ]);
    }
    
    public function orders() {
        $user = Auth::guard('web')->user();
        $orders = Order::with('items')
            ->where('customer_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->get();
            
        return Inertia::render('Shop/Orders', [
            'orders' => $orders,
        ]);
    }

}
