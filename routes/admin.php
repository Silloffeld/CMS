<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\ManageController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('admin/login',[AdminController::class , 'index']) -> name('admin.login');
Route::post('admin/login',[AdminController::class , 'login']) -> name('admin.login');

Route::middleware(['isAdmin' ,/*'verified'*/])->group(function () {
    Route::get('admin', [AdminController::class, 'dashboard']) -> name('admin.dashboard');
    Route::get('addAdmin', [AdminController::class, 'addAdmin']) -> name('admin.add');

    Route::post('addAdmin', [AdminController::class, 'storeAdmin']) -> name('admin.addAdmin');
    Route::delete('addAdmin', [AdminController::class, 'deleteAdmin']) -> name('admin.delete');

    Route::get('import',[AdminController::class, 'import']) -> name('admin.import');
    Route::post('import', [AdminController::class, 'StoreImport']) -> name('admin.import');

    Route::get('manage', [ManageController::class, 'manage']) -> name('admin.manage');
    Route::delete('manage ', [ManageController::class, 'deleteManage']) -> name('admin.delete');

    Route::get('editProduct/{product}', [ManageController::class, 'editProduct']) -> name('admin.editProduct');
    Route::post('editProduct/{product}', [ManageController::class, 'updateProduct']) -> name('admin.editProduct');
    Route::get('addProduct', [ManageController::class, 'addProduct']) -> name('admin.addProduct');
    Route::post('addProduct', [ManageController::class, 'storeProduct']) -> name('admin.addProduct');

    Route::get('addInventory', [ManageController::class, 'addInventory']) -> name('admin.addInventory');
});

