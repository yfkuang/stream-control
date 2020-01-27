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

@section('hidden')
		<div class="modal fade" id="media" tabindex="-1" role="dialog">
			<div class="modal-dialog modal-dialog-centered" role="document">
				<div class="modal-content">
					<div class="modal-header">
						<h3 class="modal-title">Add Module</h3>
						<button type="button" class="close" data-dismiss="modal" aria-label="Close">
							<span aria-hidden="true">&times;</span>
						</button>
					</div>
					<div class="modal-body">
						<div id="mediaAccordion">
							<div class="card">
								<div class="card-header" data-toggle="collapse" data-target="#mediaCollapse1">
									<h4>Upload</h4>
								</div><!--.card-header-->
								<div id="mediaCollapse1" class="collapse" data-parent="#mediaAccordion">
									<div class="card-body">
										<div class="custom-file">
											{{Form::file('file_upload', ['id' => 'upload-button', 'class' => 'custom-file-input'])}}
											<label class="custom-file-label" for="customFile">Choose file</label>
										</div>
										<br><br>
										<progress value="0" max="100" id="upload-progress" class="full-width"></progress><p id="upload-text">0%</p>
									</div>
								</div><!--#mediaCollapse1-->
							</div><!--.card-->
							<div class="card">
								<div class="card-header" data-toggle="collapse" data-target="#mediaCollapse2">
									<h4>Media List</h4>
								</div><!--.card-header-->
								<div id="mediaCollapse2" class="collapse" data-parent="#mediaAccordion">
									<div class="card-body">
										<table id="media-list" class="full-width">		
										</table>
									</div>
								</div><!--#mediaCollapse1-->
							</div><!--.card-->
						</div><!--#accordion-->
					</div>
					<div class="modal-footer">
						<button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
					</div>
				</div>
			</div>
		</div>
		
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
						<div id="elementAccordion">
							<div class="card">
								<div class="card-header" data-toggle="collapse" data-target="#elementCollapse1">
									<h4>Transform</h4>
								</div><!--.card-header-->
								<div id="elementCollapse1" class="collapse" data-parent="#elementAccordion">
									<div class="card-body">
										{{Form::label('Anchor')}}
										{{Form::select('anchor', array('topLeft' => 'Top Left', 'topRight' => 'Top Right', 'botLeft' => 'Bottom Left', 'botRight' => 'Bottom Right'), null, ['class' => 'element-setting full-width custom-select'])}}
										<div class="flex-container">
											<div class="full-width add-gutter-margin">
												{{Form::label('Position X')}}
												{{Form::text('x', null, ['class' => 'element-setting full-width form-control'])}}
											</div>
											<div class="full-width add-gutter-margin">
												{{Form::label('Position Y')}}
												{{Form::text('y', null, ['class' => 'element-setting full-width form-control'])}}
											</div>
										</div>
										<div class="flex-container">
											<div class="full-width add-gutter-margin">
												{{Form::label('Width')}}
												{{Form::text('width', null, ['class' => 'element-setting full-width form-control'])}}
											</div>
											<div class="full-width add-gutter-margin">
												{{Form::label('Height')}}
												{{Form::text('height', null, ['class' => 'element-setting full-width form-control'])}}
											</div>
										</div>
									</div>
								</div>
							</div>
							
							<div class="card">
								<div class="card-header" data-toggle="collapse" data-target="#elementCollapse2">
									<h4>Text</h4>
								</div>
								<div id="elementCollapse2" class="collapse" data-parent="#elementAccordion">
									<div class="card-body">
										{{Form::label('Font')}}
										<input class="element-setting full-width" name="font" list="font-list" placeholder="Select a font">
										<datalist id="font-list">
											@foreach(App\Http\Controllers\FontController::getFonts() as $font)
												<option value='<?php echo $font; ?>'>
											@endforeach
										</datalist>
										<div class="flex-container">
											<div class="full-width add-gutter-margin">
												{{Form::label('Text Size')}}
												{{Form::text('fontSize', null, ['class' => 'element-setting full-width form-control'])}}
											</div>
											<div class="full-width add-gutter-margin">
												{{Form::label('Font Weight')}}
												{{Form::text('fontWeight', null, ['class' => 'element-setting full-width form-control'])}}
											</div>
											<div class="full-width add-gutter-margin">
												{{Form::label('Letter Spacing')}}
												{{Form::text('letterSpace', null, ['class' => 'element-setting full-width form-control'])}}
											</div>
											<div class="full-width add-gutter-margin">
												{{Form::label('Text Align')}}
												{{Form::select('textAlign', array('right' => 'Right', 'center' => 'Center', 'left' => 'Left'), null, ['class' => 'element-setting full-width custom-select'])}}
											</div>
										</div>
									</div>
								</div>
							</div>
							
							<div class="card">
								<div class="card-header" data-toggle="collapse" data-target="#elementCollapse3">
									<h4>Animation In</h4>
								</div>
								<div id="elementCollapse3" class="collapse" data-parent="#elementAccordion">
									<div class="card-body">
										<div class="flex-container">
											<div class="full-width add-gutter-margin">
												{{Form::label('Animation')}}
												{{Form::select('animationIn', array('none' => 'None', 'fadeIn' => 'Fade In', 'fadeInFromLeft' => 'Fade In From Left', 'fadeInFromRight' => 'Fade In From Right'), null, ['class' => 'element-setting full-width custom-select'])}}
											</div>
											<div class="full-width add-gutter-margin">
												{{Form::label('Duration (ms)')}}
												{{Form::text('durationIn', null, ['class' => 'element-setting full-width form-control'])}}
											</div>
											<div class="full-width add-gutter-margin">
												{{Form::label('Delay (ms)')}}
												{{Form::text('delayIn', null, ['class' => 'element-setting full-width form-control'])}}
											</div>
										</div>
									</div>
								</div>
							</div>
							
							<div class="card">
								<div class="card-header" data-toggle="collapse" data-target="#elementCollapse4">
									<h4>Animation Out</h4>
								</div>								
								<div id="elementCollapse4" class="collapse" data-parent="#elementAccordion">
									<div class="card-body">
										<div class="flex-container">
											<div class="full-width add-gutter-margin">
												{{Form::label('Animation')}}
												{{Form::select('animationOut', array('none' => 'None', 'fadeOut' => 'Fade Out', 'fadeOutToLeft' => 'Fade Out To Left', 'fadeoutToRight' => 'Fade Out To Right'), null, ['class' => 'element-setting full-width custom-select'])}}
											</div>
											<div class="full-width add-gutter-margin">
												{{Form::label('Duration (ms)')}}
												{{Form::text('durationOut', null, ['class' => 'element-setting full-width form-control'])}}
											</div>
											<div class="full-width add-gutter-margin">
												{{Form::label('Delay (ms)')}}
												{{Form::text('delayIn', null, ['class' => 'element-setting full-width form-control'])}}
											</div>
										</div>
									</div>
								</div>
							</div>
							
							<div class="card">
								<div class="card-header" data-toggle="collapse" data-target="#elementCollapse5">
									<h4>Background Webm</h4>
								</div>
								<div id="elementCollapse5" class="collapse" data-parent="#elementAccordion">
									<div class="card-body">
										<div class="flex-container">
											{{Form::text('userUpload', null, ['class' => 'element-setting flex-wide', 'list' => 'user-uploads'])}}
											<a target="_blank" disabled class="btn"><i class="fas fa-eye"></i></a>
										</div>
										<datalist id="user-uploads">
										</datalist>
										<div class="flex-container">
											<div class="full-width add-gutter-margin">
												{{Form::label('FreezeFrame (ms)')}}
												{{Form::text('webmFreeze', null, ['class' => 'element-setting full-width form-control'])}}
											</div>
											<div class="full-width add-gutter-margin">
												{{Form::label('Duration (ms)')}}
												{{Form::text('webmduration', null, ['class' => 'element-setting full-width form-control'])}}
											</div>
											<div class="full-width add-gutter-margin">
												{{Form::label('Delay (ms)')}}
												{{Form::text('webmdelay', null, ['class' => 'element-setting full-width form-control'])}}
											</div>
										</div>
									</div>
								</div>
							</div>
							
							<div class="card">
								<div class="card-header" data-toggle="collapse" data-target="#elementCollapse6">
									<h4>Additional CSS</h4>
								</div>
								<div id="elementCollapse6" class="collapse" data-parent="#elementAccordion">
									<div class="card-body">
										{{Form::textarea('css', null, ['placeholder' => 'CSS', 'class' => 'element-setting full-width form-control'])}}
									</div>
								</div>
							</div>
						</div>
						
						<div class="modal-footer">
							<button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
							<button type="button" class="btn btn-success element-setting-apply" data-dismiss="modal">Apply</button>
						</div>
					</div>
				</div>
			</div>
		</div>
		
		<div class="modal fade" id="module-settings" tabindex="-1" role="dialog">
			<div class="modal-dialog modal-dialog-centered" role="document">
				<div class="modal-content">
					<div class="modal-header">
						<h3 class="modal-title">Module Settings</h3>
						<button type="button" class="close" data-dismiss="modal" aria-label="Close">
							<span aria-hidden="true">&times;</span>
						</button>
					</div>
					<div class="modal-body">
						<br>
						<h4>Background Webm</h4>
						<div class="full-width">
						
						</div>
						
						<br>
						<h4>Additional CSS</h4>
						{{Form::textarea('css', null, ['placeholder' => 'CSS', 'class' => 'module-setting full-width'])}}
					</div>
					<div class="modal-footer">
						<button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
						<button type="button" class="btn btn-success module-setting-apply" data-dismiss="modal">Apply</button>
					</div>
				</div>
			</div>
		</div>
@stop

@section('footer')
	<!--Hidden Lists-->
	<datalist id="melee-char">
		<option value="bowser-green">Bowser</option>
		<option value="bowser-black">Bowser Black</option>
		<option value="bowser-blue">Bowser Blue</option>
		<option value="bowser-green">Bowser Green</option>
		<option value="dk-default">Donkey Kong</option>
		<option value="dk-black">Donkey Kong Black</option>
		<option value="dk-blue">Donkey Kong Blue</option>
		<option value="dk-green">Donkey Kong Green</option>
		<option value="dk-red">Donkey Kong Red</option>
		<option value="dk-default">DK</option>
		<option value="dk-black">DK Black</option>
		<option value="dk-blue">DK Blue</option>
		<option value="dk-green">DK Green</option>
		<option value="dk-red">DK Red</option>
		<option value="doc-default">Doctor Mario</option>
		<option value="doc-black">Doctor Mario Black</option>
		<option value="doc-blue">Doctor Mario Blue</option>
		<option value="doc-green">Doctor Mario Green</option>
		<option value="doc-red">Doctor Mario Red</option>
		<option value="doc-default">Doc</option>
		<option value="doc-black">Doc Black</option>
		<option value="doc-blue">Doc Blue</option>
		<option value="doc-green">Doc Green</option>
		<option value="doc-red">Doc Red</option>
		<option value="doc-default">Dr Mario</option>
		<option value="doc-black">Dr Mario Black</option>
		<option value="doc-blue">Dr Mario Blue</option>
		<option value="doc-green">Dr Mario Green</option>
		<option value="doc-red">Dr Mario Red</option>
		<option value="falco-default">Falco</option>
		<option value="falco-blue">Falco Blue</option>
		<option value="falco-green">Falco Green</option>
		<option value="falco-red">Falco Red</option>
		<option value="falcon-default">cfalcon</option>
		<option value="falcon-black">Captain Falcon Black</option>
		<option value="falcon-Blue">Captain Falcon Blue</option>
		<option value="falcon-green">Captain Falcon Green</option>
		<option value="falcon-red">Captain Falcon Red</option>
		<option value="falcon-white">Captain Falcon White</option>
		<option value="falcon-white">Captain Falcon Pink</option>
		<option value="falcon-default">cfalcon</option>
		<option value="falcon-black">Cfalcon Black</option>
		<option value="falcon-Blue">Cfalcon Blue</option>
		<option value="falcon-green">Cfalcon Green</option>
		<option value="falcon-red">Cfalcon Red</option>
		<option value="falcon-white">Cfalcon White</option>
		<option value="falcon-white">Cfalcon Pink</option>
		<option value="falcon-default">cfalcon</option>
		<option value="falcon-black">Falcon Black</option>
		<option value="falcon-Blue">Falcon Blue</option>
		<option value="falcon-green">Falcon Green</option>
		<option value="falcon-red">Falcon Red</option>
		<option value="falcon-white">Falcon White</option>
		<option value="falcon-white">Falcon Pink</option>
		<option value="falcon-red">Blood Falcon</option>
		<option value="fox-default">Fox</option>
		<option value="fox-blue">Fox Blue</option>
		<option value="fox-green">Fox Green</option>
		<option value="fox-red">Fox Red</option>
		<option value="G&W-default">G&W</option>
		<option value="G&W-blue">G&W Blue</option>
		<option value="G&W-green">G&W Green</option>
		<option value="G&W-red">G&W Red</option>
		<option value="G&W-default">Game & Watch</option>
		<option value="G&W-blue">Game & Watch Blue</option>
		<option value="G&W-green">Game & Watch Green</option>
		<option value="G&W-red">Game & Watch Red</option>
		<option value="G&W-default">Game and Watch</option>
		<option value="G&W-blue">Game and Watch Blue</option>
		<option value="G&W-green">Game and Watch Green</option>
		<option value="G&W-red">Game and Watch Red</option>
		<option value="G&W-default">GW</option>
		<option value="G&W-blue">GW Blue</option>
		<option value="G&W-green">GW Green</option>
		<option value="G&W-red">GW Red</option>
		<option value="G&W-default">Mr Game & Watch</option>
		<option value="G&W-blue">Mr Game & Watch Blue</option>
		<option value="G&W-green">Mr Game & Watch Green</option>
		<option value="G&W-red">Mr Game & Watch Red</option>
		<option value="ganon-default">Ganon</option>
		<option value="ganon-blue">Ganon Blue</option>
		<option value="ganon-green">Ganon Green</option>
		<option value="ganon-purple">Ganon Purple</option>
		<option value="ganon-red">Ganon Red</option>
		<option value="ganon-default">Ganondorf</option>
		<option value="ganon-blue">Ganondorf Blue</option>
		<option value="ganon-green">Ganondorf Green</option>
		<option value="ganon-purple">Ganondorf Purple</option>
		<option value="ganon-red">Ganondorf Red</option>
		<option value="ICs-default">ICs</option>
		<option value="ICs-default">ICs Blue</option>
		<option value="ICs-green">ICs Green</option>
		<option value="ICs-orange">ICs Orange</option>
		<option value="ICs-red">ICs Red</option>
		<option value="ICs-default">Ice Climbers</option>
		<option value="ICs-default">Ice Climbers Blue</option>
		<option value="ICs-green">Ice Climbers Green</option>
		<option value="ICs-orange">Ice Climbers Orange</option>
		<option value="ICs-red">Ice Climbers Red</option>
		<option value="kirby-default">Kirby</option>
		<option value="kirby-blue">Kirby Blue</option>
		<option value="kirby-green">Kirby Green</option>
		<option value="kirby-red">Kirby Red</option>
		<option value="kirby-white">Kirby White</option>
		<option value="kirby-yellow">Kirby Yellow</option>
		<option value="link-green">Link</option>
		<option value="link-black">Link Black</option>
		<option value="link-blue">Link Blue</option>
		<option value="link-green">Link Green</option>
		<option value="link-red">Link Red</option>
		<option value="link-white">Link White</option>
		<option value="luigi-green">Luigi</option>
		<option value="luigi-Blue">Luigi Blue</option>
		<option value="luigi-green">Luigi Green</option>
		<option value="luigi-red">Luigi Red</option>
		<option value="luigi-white">Luigi White</option>
		<option value="mario-red">Mario</option>
		<option value="mario-black">Mario Black</option>
		<option value="mario-blue">Mario Blue</option>
		<option value="mario-green">Mario Green</option>
		<option value="mario-red">Mario Red</option>
		<option value="mario-yellow">Mario Yellow</option>
		<option value="marth-default">Marth</option>
		<option value="marth-black">Marth Black</option>
		<option value="marth-green">Marth Green</option>
		<option value="marth-red">Marth Red</option>
		<option value="marth-white">Marth White</option>
		<option value="mewtwo-default">Mewtwo</option>
		<option value="mewtwo-blue">Mewtwo Blue</option>
		<option value="mewtwo-green">Mewtwo Green</option>
		<option value="mewtwo-red">Mewtwo Red</option>
		<option value="mewtwo-default">Mew2</option>
		<option value="mewtwo-blue">Mew2 Blue</option>
		<option value="mewtwo-green">Mew2 Green</option>
		<option value="mewtwo-red">Mew2 Red</option>
		<option value="ness-default">Ness</option>
		<option value="ness-blue">Ness Blue</option>
		<option value="ness-green">Ness Green</option>
		<option value="ness-yellow">Ness Yellow</option>
		<option value="peach-default">Peach</option>
		<option value="peach-blue">Peach</option>
		<option value="peach-daisy">Peach Daisy</option>
		<option value="peach-green">Peach Green</option>
		<option value="peach-white">Peach White</option>
		<option value="peach-daisy">Daisy</option>
		<option value="pichu-default">Pichu</option>
		<option value="pichu-blue">Pichu Blue</option>
		<option value="pichu-green">Pichu Green</option>
		<option value="pichu-red">Pichu Red</option>
		<option value="pikachu-default">Pikachu</option>
		<option value="pikachu-blue">Pikachu Blue</option>
		<option value="pikachu-green">Pikachu Green</option>
		<option value="pikachu-red">Pikachu Red</option>
		<option value="puff-default">Jigglypuff</option>
		<option value="puff-crown">Jigglypuff Crown</option>
		<option value="puff-crown">Jigglypuff Princess</option>
		<option value="puff-blue">Jigglypuff Blue</option>
		<option value="puff-green">Jigglypuff Green</option>
		<option value="puff-red">Jigglypuff Red</option>
		<option value="puff-default">Puff</option>
		<option value="puff-crown">Puff Crown</option>
		<option value="puff-crown">Puff Princess</option>
		<option value="puff-blue">Puff Blue</option>
		<option value="puff-green">Puff Green</option>
		<option value="puff-red">Puff Red</option>
		<option value="roy-default">Roy</option>
		<option value="roy-blue">Roy Blue</option>
		<option value="roy-green">Roy Green</option>
		<option value="roy-red">Roy Red</option>
		<option value="roy-yellow">Roy Yellow</option>
		<option value="samus-red">Samus</option>
		<option value="samus-black">Samus Black</option>
		<option value="samus-blue">Samus Blue</option>
		<option value="samus-green">Samus Green</option>
		<option value="samus-pink">Samus Pink</option>
		<option value="samus-red">Samus Red</option>
		<option value="sheik-default">Sheik</option>
		<option value="sheik-black">Sheik Black</option>
		<option value="sheik-blue">Sheik Blue</option>
		<option value="sheik-green">Sheik Green</option>
		<option value="sheik-red">Sheik Red</option>
		<option value="smash-red">Team Red</option>
		<option value="smash-green">Team Green</option>
		<option value="smash-blue">Team Blue</option>
		<option value="yoshi-green">Yoshi</option>
		<option value="yoshi-blue">Yoshi Blue</option>
		<option value="yoshi-light blue">Yoshi Light Blue</option>
		<option value="yoshi-pink">Yoshi Pink</option>
		<option value="yoshi-red">Yoshi Red</option>
		<option value="yoshi-yellow">Yoshi Yellow</option>
		<option value="young link-default">YL</option>
		<option value="young link-black">YL Black</option>
		<option value="young link-blue">YL Blue</option>
		<option value="young link-default">YL Green</option>
		<option value="young link-red">YL Red</option>
		<option value="young link-white">YL White</option>
		<option value="young link-default">Young Link</option>
		<option value="young link-black">Young Link Black</option>
		<option value="young link-blue">Young Link Blue</option>
		<option value="young link-default">Young Link Green</option>
		<option value="young link-red">Young Link Red</option>
		<option value="young link-white">Young Link White</option>
		<option value="zelda-default">Zelda</option>
		<option value="zelda-blue">Zelda Blue</option>
		<option value="zelda-green">Zelda Green</option>
		<option value="zelda-red">Zelda Red</option>
		<option value="zelda-white">Zelda White</option>
	</datalist>
	<datalist id="countries">
		
	</datalist>
@stop