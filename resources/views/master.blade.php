<!doctype html>
<html lang="{{ app()->getLocale() }}">
    <head>
        <meta charset="utf-8">
        <!--<meta http-equiv="X-UA-Compatible" content="IE=edge">-->
		<meta name="uid" data="{{ $uid }}">
		<meta name="token" data="{{ $token }}">
        <meta name="viewport" content="width=device-width, initial-scale=1">
		<meta name="csrf-token" content="{{ csrf_token() }}">
        <link href="{{ asset('css/app.css') }}" rel="stylesheet">
		<title>Overlee Stream Control | @yield('title')</title>
    </head>
    <body>
		<header>
			<div class="container">
				@if($uid)
				<ul class="nav navbar-nav">
					<!-- <li><a href="{{ route('dashboard') }}">Dashboard</a></li> -->
					<li>{{ Form::open(['route' => 'login', 'method' => 'POST', 'class' => 'logout-form']) }}{!! Form::hidden('tokenID') !!}{!! Form::button('Logout', ['class' => 'btn btn-primary logout']) !!}{{ Form::close() }}</li>
					<li>{!! Form::button('Update', ['class' => 'btn btn-primary update']) !!}</li>
				</ul>
				@endif
			</div><!-- .container -->
		</header>
		
		<section class="content">
			<div class="container">
				@yield('content')
			</div><!--.container-->
		</section>
		
		<div class="modal fade" id="add-module" tabindex="-1" role="dialog">
			<div class="modal-dialog modal-dialog-centered" role="document">
				<div class="modal-content">
					<div class="modal-header">
						<h3 class="modal-title">Add Module</h3>
						<button type="button" class="close" data-dismiss="modal" aria-label="Close">
							<span aria-hidden="true">&times;</span>
						</button>
					</div>
					<div class="modal-body">
						{{Form::button('<i class="fas fa-fist-raised"></i> Versus', ['class' => 'btn btn-default col-xs-4 module-button add-versus', 'data-type' => 'versus', 'data-dismiss' => 'modal'])}}
						{{Form::button('<i class="fas fa-font"></i> Text', ['class' => 'btn btn-default module-button col-xs-4 add-text', 'data-type' => 'text', 'data-dismiss' => 'modal'])}}
						{{Form::button('<i class="fas fa-sitemap"></i> Bracket', ['class' => 'btn btn-default col-xs-4 module-button add-bracket', 'data-type' => 'bracket', 'data-dismiss' => 'modal'])}}
						{{Form::button('<i class="fas fa-headset"></i> Casters', ['class' => 'btn btn-default col-xs-4 module-button add-casters', 'data-type' => 'casters', 'data-dismiss' => 'modal'])}}
						{{Form::button('<i class="fas fa-align-left"></i> Lower-Thirds', ['class' => 'btn btn-default module-button col-xs-4 add-lower-thirds', 'data-type' => 'lower-thirds', 'data-dismiss' => 'modal'])}}
						{{Form::button('<i class="far fa-clock"></i> Timer', ['class' => 'btn btn-default module-button col-xs-4 add-timer', 'data-type' => 'timer', 'data-dismiss' => 'modal'])}}
						{{Form::button('<i class="fas fa-chart-bar"></i> Chart', ['class' => 'btn btn-default module-button col-xs-4 add-timer', 'data-type' => 'chart', 'data-dismiss' => 'modal'])}}
					</div>
					<div class="modal-footer">
						<button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
					</div>
				</div>
			</div>
		</div>
		
		<div class="modal fade" id="element-settings" tabindex="-1" role="dialog">
			<div class="modal-dialog modal-dialog-centered" role="document">
				<div class="modal-content">
					<div class="modal-header">
						<h3 class="modal-title">Element Settings</h3>
						<button type="button" class="close" data-dismiss="modal" aria-label="Close">
							<span aria-hidden="true">&times;</span>
						</button>
					</div>
					<div class="modal-body">
						<h4>Transform</h4>
						<div class="full-width">
							{{Form::label('Anchor')}}
							{{Form::select('anchor', array('topLeft' => 'Top Left', 'topRight' => 'Top Right', 'botLeft' => 'Bottom Left', 'botRight' => 'Bottom Right'), null, ['class' => 'element-setting full-width'])}}
							{{Form::label('Position X')}}
							{{Form::text('x', null, ['class' => 'element-setting full-width'])}}
							{{Form::label('Position Y')}}
							{{Form::text('y', null, ['class' => 'element-setting full-width'])}}
							{{Form::label('Width')}}
							{{Form::text('width', null, ['class' => 'element-setting full-width'])}}
							{{Form::label('Height')}}
							{{Form::text('height', null, ['class' => 'element-setting full-width'])}}
						</div>
						
						<br>
						<h4>Text</h4>
						<div class="full-width">
							{{Form::label('Font')}}
							<input class="element-setting full-width" name="font" list="font-list" placeholder="Select a font">
							<datalist id="font-list">
								@foreach(App\Http\Controllers\FontController::getFonts() as $font)
									<option value='<?php echo $font; ?>'>
								@endforeach
							</datalist>
							{{Form::label('Text Size')}}
							{{Form::text('font-size', null, ['class' => 'element-setting full-width'])}}
						</div>
						
						<br>
						<h4>Animation In</h4>
						<div class="full-width">
							{{Form::label('Animation')}}
							{{Form::select('animationIn', array('none' => 'None', 'fadeIn' => 'Fade In', 'fadeInFromLeft' => 'Fade In From Left', 'fadeInFromRight' => 'Fade In From Right'), null, ['class' => 'element-setting full-width'])}}
							{{Form::label('Duration (ms)')}}
							{{Form::label('Delay (ms)')}}
						</div>
						
						<br>
						<h4>Animation Out</h4>
						<div class="full-width">
							{{Form::label('Animation')}}
							{{Form::select('animationOut', array('none' => 'None', 'fadeOut' => 'Fade Out', 'fadeOutToLeft' => 'Fade Out To Left', 'fadeoutToRight' => 'Fade Out To Right'), null, ['class' => 'element-setting full-width'])}}
							{{Form::label('Duration (ms)')}}
							{{Form::label('Delay (ms)')}}
						</div>
						
						<br>
						<h4>Background Webm</h4>
						<div class="full-width">
						
						</div>
						
						<br>
						<h4>Additional CSS</h4>
						{{Form::textarea('css', 'position: absolute;
box-sizing: border-box;', ['placeholder' => 'CSS', 'class' => 'element-setting full-width'])}}
					</div>
					<div class="modal-footer">
						<button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
						<button type="button" class="btn btn-success element-setting-apply" data-dismiss="modal">Apply</button>
					</div>
				</div>
			</div>
		</div>
		
		<footer>
			<div class="container">
				<p>&copy; Overlee Stream Control by Ye Fang Kuang. Version 0.1</p>
			</div>
			<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
			<!--<script src="//netdna.bootstrapcdn.com/bootstrap/3.3.5/js/bootstrap.min.js"></script>-->
			<script src="{{ asset('js/app.js') }}"></script>
		</footer>
	</body>
</html>
