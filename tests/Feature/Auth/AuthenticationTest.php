<?php

use App\Models\User;

test('login screen can be rendered', function () {
    $response = $this->get('/login');

    // Should return JSON for headless API
    $response->assertStatus(200);
    $response->assertJson([
        'message' => 'Shop login page',
    ]);
});

test('users can authenticate using the login screen', function () {
    $user = User::factory()->create();

    $response = $this->post('/login', [
        'email' => $user->email,
        'password' => 'password',
    ]);

    $this->assertAuthenticated();
    // Now returns JSON with redirect info instead of actual redirect
    $response->assertStatus(200);
    $response->assertJson([
        'message' => 'Authenticated successfully',
    ]);
});

test('users can not authenticate with invalid password', function () {
    $user = User::factory()->create();

    $response = $this->post('/login', [
        'email' => $user->email,
        'password' => 'wrong-password',
    ]);

    $this->assertGuest();
    $response->assertStatus(401);
});

test('users can logout', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->post('/logout');

    $this->assertGuest();
    // Now returns JSON instead of redirect
    $response->assertStatus(200);
    $response->assertJson([
        'message' => 'Logged out successfully',
    ]);
});
