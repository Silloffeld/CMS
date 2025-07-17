<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('admin/login',[AdminController::class , 'index']) -> name('admin.login');
Route::post('admin/login',[AdminController::class , 'login']) -> name('admin.login');

Route::middleware(['isAdmin',/*'verified'*/])->group(function () {
    Route::get('admin', [AdminController::class, 'dashboard']) -> name('admin.dashboard');
    Route::get('addAdmin', [AdminController::class, 'addAdmin']) -> name('admin.add');

    Route::post('addAdmin', [AdminController::class, 'storeAdmin']) -> name('admin.addAdmin');
    Route::delete('addAdmin/{id}', [AdminController::class, 'deleteAdmin']) -> name('admin.delete');

    Route::get('import',[AdminController::class, 'import']) -> name('admin.import');
    Route::post('import', [AdminController::class, 'StoreImport']) -> name('admin.import');
});

