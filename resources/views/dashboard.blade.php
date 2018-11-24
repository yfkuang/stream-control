@extends('master')

@section('title')
	Dashboard
@stop
	
@section('content')
	<div class="overlays">
		
	</div><!-- .pages -->
	<div class="post-overlays">
		{{ Form::button('<i class="fas fa-plus-circle"></i> Add Overlay', ['class' => 'btn btn-primary add-overlay']) }}
	</div><!-- .post-content -->
@stop