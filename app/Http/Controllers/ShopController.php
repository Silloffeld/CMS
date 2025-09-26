<?php

namespace App\Http\Controllers;

use App\Http\Requests\Auth\LoginRequest;
use App\Models\Cart;
use App\Models\Customer;
use App\Models\Product;
use App\Models\ProductVariant;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use function Pest\Laravel\get;
use function Pest\Laravel\options;

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
        return Inertia::render('Shop/cart' , [ 'cart'  => Cart::where('user_id' , $user->id)]);
    }
    public function showProducts() {
        $productVariants = ProductVariant::all();
        $productoptions = [];

        foreach ($productVariants as $product) {
            $productoptions[] = $product->options;
        }

        if (empty($productoptions)) {
            $productoptions[] = 'products not found';
        }

        return Inertia::render('Shop/Products', [
            'products' => $productVariants,
            'productoptions' => $productoptions
        ]);
    }

}
