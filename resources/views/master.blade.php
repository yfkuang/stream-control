<!doctype html>
<html lang="{{ app()->getLocale() }}">
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">
		<meta name="csrf-token" content="{{ csrf_token() }}">
        <link href="{{ asset('css/app.css') }}" rel="stylesheet">
        <title>Overlee Stream Control | @yield('title')</title>
    </head>
    <body>
		<div class="container">
        	@yield('content')
		</div><!--.container-->
		
		<footer>
			<div class="container">
				<p>&copy; Overlee Stream Control by Ye Fang Kuang.</p>
			</div>
			<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
			<!--<script src="//netdna.bootstrapcdn.com/bootstrap/3.3.5/js/bootstrap.min.js"></script>-->
			<script src="{{ asset('js/app.js') }}"></script>
		</footer>
	</body>
</html>
