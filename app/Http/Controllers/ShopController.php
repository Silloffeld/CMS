<?php

namespace App\Http\Controllers;

use App\Http\Requests\Auth\LoginRequest;
use App\Models\Cart;
use App\Models\Customer;
use App\Models\ProductVariant;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ShopController extends Controller
{
    public function login(): JsonResponse
    {
        return response()->json([
            'message' => 'Shop login page',
        ]);
    }

    public function register(): JsonResponse
    {
        return response()->json([
            'message' => 'Shop registration page',
        ]);
    }

    public function account(): JsonResponse
    {
        $user = Auth::guard('web')->user();

        return response()->json([
            'user' => $user,
        ]);
    }

    public function authenticate(LoginRequest $request): JsonResponse
    {
        if (Auth::guard('web')->attempt($request->only('email', 'password'))) {
            $request->session()->regenerate();

            return response()->json([
                'message' => 'Authenticated successfully',
                'redirect' => route('shop.account', absolute: false),
            ]);
        }

        return response()->json([
            'error' => 'Invalid email or password.',
        ], 401);
    }

    public function storeAccount(Request $request): JsonResponse
    {
        $creds = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:customers',
            'password' => 'required|string|min:6|confirmed',
            'password_confirmation' => 'required|string|min:6',
        ]);

        if ($creds['password'] !== $creds['password_confirmation']) {
            return response()->json([
                'error' => 'Password does not match.',
            ], 422);
        }

        Customer::create([
            'email' => $creds['email'],
            'password' => bcrypt($creds['password']),
        ]);

        return response()->json([
            'message' => 'Account created successfully',
            'redirect' => route('shop.login'),
        ]);
    }

    public function cart(): JsonResponse
    {
        $user = Auth::guard('web')->user();

        return response()->json([
            'cart' => Cart::where('user_id', $user->id)->get(),
        ]);
    }

    public function showProducts(): JsonResponse
    {
        $productVariants = ProductVariant::all();
        $productoptions = [];

        foreach ($productVariants as $product) {
            $productoptions[] = $product->options;
        }

        if (empty($productoptions)) {
            $productoptions[] = 'products not found';
        }

        return response()->json([
            'products' => $productVariants,
            'productoptions' => $productoptions,
        ]);
    }
}
