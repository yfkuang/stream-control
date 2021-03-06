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
					<li>{!! Form::button('Media Files', ['class' => 'btn btn-secconday media', 'data-toggle' => 'modal', 'data-target' => "#media"]) !!}</li>
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
		
		@yield('hidden')
		
		<footer>
			<div class="container">
				<p>&copy; Overlee Stream Control by Ye Fang Kuang. Version 0.1</p>
			</div>
			
			@yield('footer')
			
			<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
			<!--<script src="//netdna.bootstrapcdn.com/bootstrap/3.3.5/js/bootstrap.min.js"></script>-->
			<script src="{{ asset('js/app.js') }}"></script>
		</footer>
	</body>
</html>
