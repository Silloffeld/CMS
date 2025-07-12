<?php

namespace App\Http\Controllers;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use function Termwind\render;

class AdminController extends Controller
{
//    public function login(){
//        return Inertia::render('admin/auth/verify-email');
//    }
    public function index()
    {
        $admins = User::all();
        return Inertia::render('admin/auth/login', [
            'admins' => $admins
        ]);
    }
    public function addAdmin()
    {
        return Inertia::render('admin/addAdmin');
    }
    public function dashboard()
    {
        return Inertia::render('admin/dashboard');
    }

    public function store(LoginRequest $request): RedirectResponse
    {
        $request->authenticate();

        $request->session()->regenerate();

        return redirect()->intended(route('admin.dashboard', absolute: false));
    }
}
