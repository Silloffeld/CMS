<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\ShopController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

route::get('/login',[ShopController::class , 'login'] ) -> name('shop.login');
route::post('/login',[ShopController::class , 'authenticate'] ) -> name('shop.login');

route::get('/register',[ShopController::class , 'register'] ) -> name('shop.register');
route::post('/register',[ShopController::class , 'storeAccount'] ) -> name('shop.register');

Route::get('/account',[ShopController::class , 'account'] ) -> name('shop.account');
//TODO:update account

Route::get('/cart/{id}',[ShopController::class , 'cart'] ) -> name('shop.cart');

Route::get('/products',[ShopController::class , 'showProducts']) -> name('shop.products');
