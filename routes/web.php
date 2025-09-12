<?php

use App\Http\Controllers\AdminController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

route::get('/', function () {
    return inertia::render('Shop/welcome');
})->name('home');


require __DIR__.'/admin.php';
require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
require __DIR__.'/shop.php';
