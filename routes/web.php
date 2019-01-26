<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get(
    '/',
	['as' => 'index',
     'uses' => 'FirebaseController@login'
    ]
);

Route::post(
    '/',
	['as' => 'login',
     'uses' => 'FirebaseController@login'
    ]
);

Route::get(
    'dashboard',
    ['as' => 'dashboard',
     'uses' => 'DashboardController@dashboard'
    ]
);


/*--------------
//Ajax
--------------*/

/*--------------
//Dynamic URLs
--------------*/
// Catch all page controller (place at the very bottom)
Route::get('{slug}', [
    'uses' => 'OverlayController@getOverlay' 
])->where('slug', '([A-Za-z0-9\-\/]+)');