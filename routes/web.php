<?php

use Illuminate\Support\Facades\Route;

// API-style route for the home page
route::get('/api', function () {
    return response()->json([
        'message' => 'Shop welcome page',
    ]);
})->name('api.home');

// Serve the React app for all non-API routes
Route::get('/{any?}', function () {
    return view('app');
})->where('any', '^(?!api).*$')->name('home');

require __DIR__.'/admin.php';
require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
require __DIR__.'/shop.php';
