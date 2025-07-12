<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('admin/login',[AdminController::class , 'index']) -> name('admin.login');
Route::post('admin',[AdminController::class , 'store']) -> name('admin.store');

Route::middleware(['isAdmin',/*'verified'*/])->group(function () {
    Route::get('admin', [AdminController::class, 'dashboard']) -> name('admin.dashboard');
    Route::get('addAdmin', [AdminController::class, 'addAdmin']) -> name('admin.add');
});

