<?php

namespace App\Http\Controllers;

use App\Http\Requests\Auth\LoginRequest;
use App\Models\Customer;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ShopController extends Controller
{
    public function login(){
        return Inertia::render('shop/login');
    }
    public function register(){
        return Inertia::render('shop/register');
    }
    public function account(){
       $user = Auth::guard('web')->user();
        return Inertia::render('shop/account' , [ 'user' => $user ]);
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
            return Inertia::render('shop/login');}
    }


}
