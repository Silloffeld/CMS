<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class EmailVerificationPromptController extends Controller
{
    /**
     * Get email verification prompt page data.
     */
    public function __invoke(Request $request): JsonResponse
    {
        if ($request->user()->hasVerifiedEmail()) {
            return response()->json([
                'verified' => true,
                'redirect' => route('dashboard', absolute: false),
            ]);
        }

        return response()->json([
            'verified' => false,
            'status' => $request->session()->get('status'),
        ]);
    }
}
