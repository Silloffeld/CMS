<?php

use App\Http\Controllers\ShopController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/login',[ShopController::class , 'login']) -> name('customer.login');
Route::post('/login',[ShopController::class , 'Checklogin']) -> name('customer.login');


