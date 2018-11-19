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
        @yield('content')
		<footer>
			<p>&copy; Overlee Stream Control by Ye Fang Kuang.</p>
		</footer>
	</body>
</html>
