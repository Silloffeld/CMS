<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Customer;

class ShopController extends Controller
{
    public function login(){
        return Inertia::render('Shop/auth/login');
    }
    public function CheckLogin(Request $req){
        $users = Customer::all();
    }
}
