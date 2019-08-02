<!doctype html>
<html>
<head>
	<meta charset="utf-8">
	<!--<meta http-equiv="X-UA-Compatible" content="IE=edge">-->
	<meta name="uid" data="@php $uid = explode('/',url()->current()); echo $uid[3]; @endphp">
	<meta name="overlayid" data="@php $uid = explode('/',url()->current()); echo $uid[4]; @endphp">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<meta name="csrf-token" content="{{ csrf_token() }}">
	<style>
		@font-face {
		  font-family: Montserrat;
		  src: url('https://fonts.googleapis.com/css?family=Montserrat');
		}
		
		html, body{
			position: absolute;
			top: 0;
			left: 0;
			width: 1280px;
			height: 720px;
			font-family: Montserrat;
			text-transform: uppercase;
			text-shadow: 0px 0px 3px rgba(0,0,0,0.5);
			margin: 0;
		}
	</style>
</head>
<body class="overlay-program">
	<footer>
		<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
		<!--<script src="//netdna.bootstrapcdn.com/bootstrap/3.3.5/js/bootstrap.min.js"></script>-->
		<script src="{{ asset('js/app.js') }}"></script>
	</footer>
</body>
</html>