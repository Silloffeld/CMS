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
    public function index()
    {
        $admins = User::all();
        return Inertia::render('admin/auth/login', [
            'admins' => $admins
        ]);
    }
    public function addAdmin()
    {
        // Only the head admin can access this page
        if (!auth()->user()->is_super) {
            abort(403, 'Only the head admin can manage other admins.');
        }

        $admins = User::where('is_admin', true)->get();
        return Inertia::render('admin/addAdmin', [
            'admins' => $admins,
            'is_super' => auth()->user()->is_super
        ]);
    }

    public function storeAdmin(Request $request)
    {
        $maxAdmins = 5;

        $adminCount = \App\Models\User::where('is_admin', true)->count();
        if ($adminCount >= $maxAdmins) {
            // Optionally use a redirect or validation error
            return back()->withErrors(['admin_limit' => 'Maximum admin count reached.']);
        }

        // Validate and create as usual
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8',
        ]);

        $admin = \App\Models\User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => bcrypt($request->password),
            'is_admin' => true,
        ]);
        return redirect()->route('admin.addAdmin')->with('success', 'Admin added!');
    }
    public function deleteAdmin($id)
{
    $admin = User::findOrFail($id);
    $admin->delete();

    // Return updated list of admins
    $admins = User::where('is_admin', true)->get();
    return Inertia::render('admin/addAdmin', [
        'admins' => $admins
    ]);
}
    public function dashboard()
    {
        return Inertia::render('admin/dashboard',['is_super' => auth()->user()->is_super]);
    }

    public function login(LoginRequest $request): RedirectResponse
    {
        $request->authenticate();

        $request->session()->regenerate();

        return redirect()->intended(route('admin.dashboard', absolute: false));
    }
}
