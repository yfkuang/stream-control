<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function dashboard(Request $request)
    {
		$token = session('token');
		
		if(!$token){
			return redirect()->route('index');
		} else {
			$uid = FirebaseController::verifyToken($token);
		
			$context = [
				'uid' => $uid,
				'token' => $token
			];

			return response()->view('dashboard', $context);
		}
		
		return response()->view('dashboard');
    }
}

