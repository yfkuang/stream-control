<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class FontController extends Controller
{	
	public static function getFonts()
	{
		$url = 'https://www.googleapis.com/webfonts/v1/webfonts?key='.$_ENV["FIREBASE_API"]; // path to your JSON file
		$data = file_get_contents($url); // put the contents of the file into a variable
		$json = json_decode($data); // decode the JSON feed
		$fonts = array();
		
		foreach ($json->items as $font){
			array_push($fonts, $font->family);
		}
		
		return $fonts;
	}
}	
?>