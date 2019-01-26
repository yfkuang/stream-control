<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\User;

class OverlayController extends Controller
{	
	public function getOverlay($slug = null)
	{
		return view('overlay')->with('page');
	}
}	
?>