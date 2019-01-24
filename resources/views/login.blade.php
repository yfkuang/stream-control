@extends('master')

@section('title')
	Login
@stop

@section('content')
	<div>
		{{ Form::open(['route' => 'login', 'method' => 'POST', 'class' => 'login-form']) }}
			<h2 style="text-align: center;">Login</h2>
			{!! Form::text('email', '', ['placeholder' => 'Email']) !!}<br>
			{!! Form::password('password',['placeholder' => 'Password']) !!}
			{!! Form::hidden('tokenID') !!}<br>
			{!! Form::button('Login', ['class' => 'btn btn-primary login']) !!}
		{{ Form::close() }}
	</div>
@stop