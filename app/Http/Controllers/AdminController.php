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
        $admins = User::where('is_admin' , true)->get();

        return Inertia::render('admin/addAdmin',[
            'admins' => $admins
        ]);
    }
    public function storeAdmin(Request $request)
    {
        $maxAdmins = 5;

        $adminCount = User::where('is_admin', true)->count();

        if ($adminCount >= $maxAdmins) {
            return back()->withErrors(['admin_limit' => 'Maximum admin count reached.']);
        }

        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8',
        ]);

        User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => bcrypt($request->password),
            'is_admin' => true,
        ]);

        // Redirect to the addAdmin page
        return redirect()->route('admin.add');
    }

    public function deleteAdmin($id)
    {
        $admin = User::findOrFail($id);
        $admin->delete();

        // Redirect to the addAdmin page, which will fetch fresh list of admins
        return redirect()->route('admin.add');
    }
    public function dashboard()
    {
        return Inertia::render('admin/dashboard');
    }

    public function login(LoginRequest $request): RedirectResponse
    {
        $request->authenticate();

        $request->session()->regenerate();

        return redirect()->intended(route('admin.dashboard', absolute: false));
    }
}
