<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\ShopController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/login',[ShopController::class , 'login'] ) -> name('shop.login');
Route::post('/login',[ShopController::class , 'authenticate'] ) -> name('shop.login');

Route::get('/register',[ShopController::class , 'register'] ) -> name('shop.register');
Route::post('/register',[ShopController::class , 'storeAccount'] ) -> name('shop.register');

Route::get('/products',[ShopController::class , 'showProducts']) -> name('shop.products');

Route::middleware('auth:web')->group(function () {
    Route::get('/account',[ShopController::class , 'account'] ) -> name('shop.account');
    Route::post('/account',[ShopController::class , 'updateAccount'] ) -> name('shop.account.update');
    
    Route::get('/cart',[ShopController::class , 'cart'] ) -> name('shop.cart');
    Route::post('/cart/add',[ShopController::class , 'addToCart'] ) -> name('shop.cart.add');
    Route::put('/cart/{id}',[ShopController::class , 'updateCartItem'] ) -> name('shop.cart.update');
    Route::delete('/cart/{id}',[ShopController::class , 'removeFromCart'] ) -> name('shop.cart.remove');
    
    Route::get('/checkout',[ShopController::class , 'checkout'] ) -> name('shop.checkout');
    Route::post('/checkout',[ShopController::class , 'processCheckout'] ) -> name('shop.checkout.process');
    
    Route::get('/orders',[ShopController::class , 'orders'] ) -> name('shop.orders');
    Route::get('/order/{orderId}/confirmation',[ShopController::class , 'orderConfirmation'] ) -> name('shop.order.confirmation');
});
