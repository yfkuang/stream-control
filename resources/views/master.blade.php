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
