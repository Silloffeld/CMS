<?php

namespace App\Http\Controllers;
use Inertia\Inertia;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use function Termwind\render;

class AdminController extends Controller
{
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

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:admins,email',
            'password' => 'required|string|min:8|confirmed',
        ]);

        User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        return redirect()->route('admin.index')->with('success', 'User user created!');
    }
}
