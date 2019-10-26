/*--------------
//Dashboard
--------------*/

/*Retrieve user ID*/
var uid = $('meta[name="uid"]').attr('data');

/*--------------
//General Functions
--------------*/
function makeid() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 10; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
	
  return text;
}


/*--------------
//Buttons
--------------*/
//Update all inputs
function update(){
	
	$('input.updateable').each(function(){
		var overlayid = $(this).parents('.overlay').data('overlayid');
		var moduleid = $(this).parents('.module').data('moduleid');
		var element = $(this).attr('name');
		
		firebase.firestore().collection('users').doc(uid).collection('overlays').doc(overlayid).collection('modules').doc(moduleid).collection('elements').doc(element).update({
			value: $(this).val(),
		}).then(function(){
			console.log(overlayid + " " + moduleid + " " + element + " updated!");
		}).catch(err => {
			firebase.firestore().collection('users').doc(uid).collection('overlays').doc(overlayid).collection('modules').doc(moduleid).collection('elements').doc(element).set({
				value: $(this).val(),
			}).then(function(){
				console.log(overlayid + " " + moduleid + " " + element + " set!");
			});
		});
		firebase.firestore().collection('users').doc(uid).collection('overlays').doc(overlayid).collection('modules').doc(moduleid).collection('elements').doc(element).update({
				value: $(this).val(),
		}).then(function(){
			console.log(overlayid + " " + moduleid + " " + element + " updated!");
		});
	});	
}

//Assign target element when modal pops up
function listenElementSettings(moduleid){
	if(moduleid){
		$('.module[data-moduleid=' + moduleid + '] .element-settings-button').each(function(){
			$(this).click(function(){
				var element = $(this).attr('data-element');
				var overlayid = $(this).parents('.overlay').data('overlayid');

				$('.element-setting').each(function(){
					$(this).attr('data-element', element);
					$(this).attr('data-overlayid', overlayid);
					$(this).attr('data-moduleid', moduleid);
				});
				
				displaySettings(overlayid,moduleid,element);
			});
		});
	} else {
		$('.element-settings-button').each(function(){
			$(this).click(function(){
				var element = $(this).attr('data-element');
				var overlayid = $(this).parents('.overlay').attr('data-overlayid');
				var moduleid = $(this).parents('.module').attr('data-moduleid');

				$('.element-setting').each(function(){
					$(this).attr('data-element', element);
					$(this).attr('data-overlayid', overlayid);
					$(this).attr('data-moduleid', moduleid);
				});
				
				displaySettings(overlayid,moduleid,element);
			});
		});
	}
}

//Update element settings
$('.element-setting-apply').click(function(){
	$('.element-setting').each(function(){
		var overlayID = $(this).attr('data-overlayid');
		var moduleid = $(this).attr('data-moduleid');
		var element = $(this).attr('data-element');
		var elementName = $(this).attr('name');
		var value = $(this).val();
		firebase.firestore().collection('users').doc(uid).collection('overlays').doc(overlayID).collection('modules').doc(moduleid).collection('elements').doc(element).update({
				[elementName]: value,
		}).then(function(){
			console.log(overlayID + " " + moduleid + " " + element + " " + elementName + " updated!");
		}).catch(err => {
			firebase.firestore().collection('users').doc(uid).collection('overlays').doc(overlayID).collection('modules').doc(moduleid).collection('elements').doc(element).set({
				[elementName]: value,
			}).then(function(){
				console.log(overlayID + " " + moduleid + " " + element + " " + elementName + " updated!");
			});
		});
	});

});

//Update module settings
$('.module-setting-apply').click(function(){
	$('.module-setting').each(function(){
		var overlayID = $(this).attr('data-overlayid');
		var moduleid = $(this).attr('data-moduleid');
		var moduleName = $(this).attr('name');
		var value = $(this).val();
		firebase.firestore().collection('users').doc(uid).collection('overlays').doc(overlayID).collection('modules').doc(moduleid).update({
				[moduleName]: value,
		}).then(function(){
			console.log(overlayID + " " + moduleid + " " + moduleName + " updated!");
		});
	})

});

//Toggleable elements
function listenToggle(overlayID, module){
	
	$('toggle-hide').each(function(){
		var element = $(this).data('element');
		
		/*firebase.firestore().collection('users').doc(uid).collection("overlays").doc(overlayID).collection("modules").doc(module.id).collection("elements").doc("element").onSnapshot(snapshot => {
			let changes = snapshot.docChanges();
			//console.log(changes);
			changes.forEach(change =>{
				//console.log(change.doc.data());
				if(change.type == 'added'){
					//displayModule(data.id, change.doc);
					console.log(change.doc);
				} else if (change.type == 'removed'){
					
				} else if (change.type == 'modified'){
					
				}
			});
		});
		
		if(doc.data().status == undefined || doc.data().status == false){
			$('.takel3d').removeClass("btn-warning");
		} else if (doc.data().status == true){
			$('.takel3d').addClass("btn-warning");
		}
		
		$(this).click(function(){
			if(doc.data().status == undefined || doc.data().status == false){
				firebase.firestore().collection('users').doc(uid).collection('overlays').doc(overlayID).collection('modules').doc(doc.id).update({
					status: true,
				}).then(function(){
					console.log(overlayID + " " + doc.id + " lower-third taken!");
				});
			} else if (doc.data().status == true){
				firebase.firestore().collection('users').doc(uid).collection('overlays').doc(overlayID).collection('modules').doc(doc.id).update({
					status: false,
				}).then(function(){
					console.log(overlayID + " " + doc.id + " lower-third off!");
				});
			}
		});*/
	});
	
}

/*--------------
//Module Functions
--------------*/
function addModule(overlayid, overlayName, type){
	var newModule = makeid() + '-' + type;
	console.log('New module added to ' + overlayid + ' (' + overlayName + '): ' + newModule);
	
	// Write new Module to overlay's 'modules' collection
	firebase.firestore().collection('users').doc(uid).collection('overlays').doc(overlayid).collection('modules').doc(newModule).set({
		type: type,
	});

}

function removeModule(overlayid,moduleID){
	firebase.firestore().collection("users").doc(uid).collection("overlays").doc(overlayid).collection('modules').doc(moduleID).delete().then(function() {
		console.log(moduleID + " deleted!");
	}).catch(function(error) {
		console.error("Error removing document" + moduleID + ": ", error);
	});
}

function displayModule(overlayID, doc){
	if (doc.exists) {
		//console.log(doc.data);			

		$('.overlay-id[value='+ overlayID +']').parent().children('.modules').append(
			'<div class="module" data-moduleid="' + doc.id + '" data-type="' + doc.data().type + '">' +
				'<h4 class="">' + doc.data().type + '</h4>' +
				'<input type="hidden" class="module-content-end"><br>' +
				'<button class="btn btn-light module-settings-button" type="button" data-toggle="modal" data-target="#module-settings" data-moduleid="' + doc.id + '"><i class="fas fa-cog"></i>&nbsp;Module Settings</button>' +
				'<button class="btn btn-danger remove-module" type="button"><i class="fas fa-trash-alt"></i>&nbsp;Remove Module</button>' +
				'<br class="clear">' +
			'</div>');
		
		//Display module based on type
		switch(doc.data().type){

			case 'versus'://Versus

				$('.module[data-moduleid=' + doc.id + '] h4').after(
					'<input class="updateable full-width" name="game" list="games-list" placeholder="Select a game category">' +
					'<datalist id="games-list">' +
						'<option value="Super Smash Bros. Melee Singles">' +
						'<option value="Super Smash Bros. Melee Doubles">' +
						'<option value="Overwatch">' +
					'</datalist>'
				);

				//display appropriate inputs on list value (game category) change
				$('.module[data-moduleid=' + doc.id + '] .updateable[name=game]').change(function(){
					var game = $(this).val();
					
					console.log(doc.id + " game category changed to " + game);
					$('.module[data-moduleid=' + doc.id + ']  .game').remove();
					
					displayVersus(overlayID, doc, game);
				});
				
				break;
				
			case 'text':
				$('.module[data-moduleid=' + doc.id + '] h4').after(
					'<div class="flex-container full-width">' +
						'<input class="updateable flex-wide" type="text" name="text" placeholder="Text">' +
						'<button class="btn btn-light element-settings-button" data-element="text" type="button" data-toggle="modal" data-target="#element-settings"><i class="fas fa-cog"></i></button>' +
					'</div>'
				);
				
				listenElementSettings(doc.id);
				
				break;

			case 'lower-thirds'://Lower-Thirds

				$('.module[data-moduleid=' + doc.id + '] h4').after(
					'<div class="flex-container full-width">' +
						'<input class="updateable flex-wide" type="text" name="upperl3d" placeholder="Upper Lower-Third">' +
						'<button class="btn btn-light element-settings-button" type="button" data-toggle="modal" data-target="#element-settings"><i class="fas fa-cog"></i></button>' +
					'</div>' +
					'<div class="flex-container full-width">' +
						'<input class="updateable flex-wide" type="text" name="lowerl3d" placeholder="Lower Lower-Third">' +
						'<button class="btn btn-light element-settings-button" type="button" data-toggle="modal" data-target="#element-settings"><i class="fas fa-cog"></i></button>' +
					'</div>' +
					'<button class="btn takel3d" type="button"><i class="fas fa-camera"></i> Take Overlay</button>'
				);
				
				//Displat "take l3d" state
				if(doc.data().status == undefined || doc.data().status == false){
					$('.takel3d').removeClass("btn-warning");
				} else if (doc.data().status == true){
					$('.takel3d').addClass("btn-warning");
				}
				
				//Take l3d function
				$('.takel3d').click(function(){
					if(doc.data().status == undefined || doc.data().status == false){
						firebase.firestore().collection('users').doc(uid).collection('overlays').doc(overlayID).collection('modules').doc(doc.id).update({
							status: true,
						}).then(function(){
							console.log(overlayID + " " + doc.id + " lower-third taken!");
						});
					} else if (doc.data().status == true){
						firebase.firestore().collection('users').doc(uid).collection('overlays').doc(overlayID).collection('modules').doc(doc.id).update({
							status: false,
						}).then(function(){
							console.log(overlayID + " " + doc.id + " lower-third off!");
						});
					}
				});

				break;
			
			case 'casters'://Casters
				$('.module[data-moduleid=' + doc.id + '] h4').after(
					'<div class="flex-container">' +
						'<div class="flex-container flex-wide">' +
							'<button class="btn btn-light element-settings-button" data-element="casterTag1" type="button" data-toggle="modal" data-target="#element-settings"><i class="fas fa-cog"></i></button>' +
							'<input class="updateable flex-wide" type="text" name="casterTag1" placeholder="Caster Tag">' +
						'</div>' +
						'<div class="flex-container flex-wide">' +
							'<button class="btn btn-light element-settings-button" data-element="casterTag2" type="button" data-toggle="modal" data-target="#element-settings"><i class="fas fa-cog"></i></button>' +
							'<input class="updateable flex-wide" type="text" name="casterTag2" placeholder="Caster Tag">' +
						'</div>' +
						'<div class="flex-container flex-wide">' +
							'<button class="btn btn-light element-settings-button" data-element="casterTag3" type="button" data-toggle="modal" data-target="#element-settings"><i class="fas fa-cog"></i></button>' +
							'<input class="updateable flex-wide" type="text" name="casterTag3" placeholder="Caster Tag">' +
						'</div>' +
					'</div>' +
					'<div class="flex-container">' +
						'<div class="flex-container flex-wide">' +
							'<button class="btn btn-light element-settings-button" data-element="casterTwitter1" type="button" data-toggle="modal" data-target="#element-settings"><i class="fas fa-cog"></i></button>' +
							'<input class="updateable flex-wide" type="text" name="casterTwitter1" placeholder="Caster Twitter">' +
						'</div>' +
						'<div class="flex-container flex-wide">' +
							'<button class="btn btn-light element-settings-button" data-element="casterTwitter2" type="button" data-toggle="modal" data-target="#element-settings"><i class="fas fa-cog"></i></button>' +
							'<input class="updateable flex-wide" type="text" name="casterTwitter2" placeholder="Caster Twitter">' +
						'</div>' +
						'<div class="flex-container flex-wide">' +
							'<button class="btn btn-light element-settings-button" data-element="casterTwitter3" type="button" data-toggle="modal" data-target="#element-settings"><i class="fas fa-cog"></i></button>' +
							'<input class="updateable flex-wide" type="text" name="casterTwitter3" placeholder="Caster Twitter">' +
						'</div>' +
					'</div>'
				);
				
				break;
				
			case 'timer'://Timer
				
				
				break;
		}
		
		//listen to element settings buttons
		//listenElementSettings();
		
		//listen to toggleable elements
		listenToggle(overlayID, doc);
		
		//Get data from database E.g. previous session
		displayData(overlayID, doc);
		
		//Add event handler to remove module
		$('.modules').find('.remove-module').each(function(i){
			$(this).click(function(e){
				var deleteModule = confirm("Delete module: Are you sure?");
				if (deleteModule){
					removeModule($(this).parent().parent().parent().children('.overlay-id').val(), $(this).parent().data("moduleid"));
				}
			});
		});

	} else {
		// doc.data() will be undefined in this case
		console.log("No modules!");
	}	
}

//Function for getting data from database E.g. previous session
function displayData(overlayID, doc){
	
		doc.ref.collection("elements").get().then(function(elements){
			elements.docs.forEach(function(element){
				if(element.exists){
					//console.log(element.id + ": " + element.data().value);
					$('.module[data-moduleid=' + doc.id + '] input.updateable[name=' + element.id + ']').each(function(){
						
						switch($(this).attr('name')){
							case 'game':
								$(this).val(element.data().value);
								displayVersus(overlayID, doc, element.data().value);
								
								break;
								
							default:
							   $(this).val(element.data().value);
							   
							   break;
						}
						
						console.log(doc.id + ", " + $(this).attr('name') + ", " + $(this).val());
					});
				}
			});
		});
}

//Function for getting data from database E.g. previous session
function displaySettings(overlayID, moduleid, element){
	firebase.firestore().collection('users').doc(uid).collection('overlays').doc(overlayID).collection('modules').doc(moduleid).collection("elements").doc(element).get().then(function(element){
		$.each(element.data(), function(key, value){
			$('#element-settings .element-setting[name=' + key + ']').each(function(){
				$(this).val(value);
			});
		});
	});
}

//Function for displaying appropriate inputs on list value (game category) change
function displayVersus(overlayID, module, game){

	switch(game){
		case 'Super Smash Bros. Melee Singles':
			/*$('.overlay-id[value='+ overlayID +']').parent().children('.modules').append(

			);*/

			break;

		case 'Super Smash Bros. Melee Doubles':
			/*$('.overlay-id[value='+ overlayID +']').parent().children('.modules').append(

			);*/

			break;

		case 'Overwatch':
			//console.log("test");
			$('.overlay[data-overlayid=' + overlayID + '] .module[data-moduleid=' + module.id + '] .updateable[name=game]').after(
				'<div class="game" >' +
					'<div class="flex-container full-width ">' +
						'<button class="btn btn-light element-settings-button" data-element="ow-teamLeft" type="button" data-toggle="modal" data-target="#element-settings"><i class="fas fa-cog"></i></button>' +
						'<button class="btn btn-light toggle-hide" type="button" data-element="ow-teamLeft"><i class="fas fa-eye"></i></i></button>' +
						'<input class="updateable flex-wide" type="text" name="ow-teamLeft" placeholder="Left Team Name">' +
						'<button class="btn btn-primary switch" data-switch="team" type="button"><i class="fas fa-sync-alt"></i></button>' +
						'<input class="updateable flex-wide" type="text" name="ow-teamRight" placeholder="Right Team Name">' +
						'<button class="btn btn-light toggle-hide" type="button" data-element="ow-teamRight"><i class="fas fa-eye"></i></i></button>' +
						'<button class="btn btn-light element-settings-button" data-element="ow-teamRight" type="button" data-toggle="modal" data-target="#element-settings"><i class="fas fa-cog"></i></button>' +
					'</div>' +
					'<div class="flex-container flex-center full-width ">' +
						'<button class="btn btn-light element-settings-button" data-element="ow-scoreLeft" type="button" data-toggle="modal" data-target="#element-settings"><i class="fas fa-cog"></i></button>' +
						'<button class="btn btn-light toggle-hide" type="button" data-element="ow-scoreLeft"><i class="fas fa-eye"></i></i></button>' +
						'<input class="updateable" type="number" name="ow-scoreLeft" size="2" value="0" min="0">' +
						'<button class="btn btn-primary switch" data-switch="score" type="button"><i class="fas fa-sync-alt"></i></button>' +
						'<input class="updateable" type="number" name="ow-scoreRight" size="2" value="0" min="0">' +
						'<button class="btn btn-light toggle-hide" type="button" data-element="ow-scoreRight"><i class="fas fa-eye"></i></i></button>' +
						'<button class="btn btn-light element-settings-button" data-element="ow-scoreRight" type="button" data-toggle="modal" data-target="#element-settings"><i class="fas fa-cog"></i></button>' +
					'</div>' +
				'</div>'
			);

			break;
	}
	
	//listen to element settings buttons
	listenElementSettings(module.id);
}

/*--------------
//Overlay Functions
--------------*/
function addOverlay(){
	var newOverlay = makeid();
	console.log('New overlay added: ' + newOverlay);
	firebase.firestore().collection('users').doc(uid).collection('overlays').doc(newOverlay).set({
		name: "New Overlay"
	});
}

function removeOverlay(overlayid){
	firebase.firestore().collection("users").doc(uid).collection("overlays").doc(overlayid).delete().then(function() {
		console.log("Overlay " + overlayid + " deleted!");
	}).catch(function(error) {
		console.error("Error removing overlay" + overlayid + ": ", error);
	});
	
	/*Add delete modules afterwards*/
}

function displayOverlay(data){
	var dataName = data._document.data.internalValue.root.value.internalValue;
	
	$('.overlays').append(
		'<div class="overlay" data-overlayid="' + data.id + '" data-overlayname="' + dataName + '">' +
			'<input class="overlay-id" type="hidden" value="' + data.id + '">' +
			'<div class="flex-container full-width">' +
				'<h3 class="overlay-name">' + dataName + '</h3>' +
			'</div>' +
			'<p><b>Overlay Link:</b> <a class="link" target="_blank" href="http://control.streamland.ca/' + uid + '/' + data.id + '">' + 'control.streamland.ca/' + uid + '/' + data.id + '</a> <button type="button" class="btn btn-light copy-clip"><i class="fas fa-clipboard"></i></button></p>' +
			'<div class="modules"></div>' +
			'<button class="btn btn-primary add-module" type="button" data-toggle="modal" data-target="#add-module"><i class="fas fa-plus-circle"></i> Add Module</button>' +
			'<button class="btn btn-danger remove-overlay" type="button"><i class="fas fa-trash-alt"></i> Remove Overlay</button>' +
			'<br class="clear">' +
		'</div>');
	
	//Copy to clipboard
	/*$(".copy-clip").click(function(){
		var temp = $("<input>");
  		$("body").append(temp);
		temp.val($(".overlay[dataoverlayid=" + data.id + "] .link").attr('href')).select();
		document.execCommand("copy");
		console.log("copy to clipboard!");
	});*/
	
	//Add and listen to modules
	firebase.firestore().collection('users').doc(uid).collection("overlays").doc(data.id).collection("modules").onSnapshot(snapshot => {
		let changes = snapshot.docChanges();
		//console.log(changes);
		changes.forEach(change =>{
			//console.log(change.doc.data());
			if(change.type == 'added'){
				displayModule(data.id, change.doc);
				//console.log(change.doc);
			} else if (change.type == 'removed'){
				$('.module[data-moduleid='+ change.doc.id +']').remove();
			} else if (change.type == 'modified'){
				$('.module[data-moduleid='+ change.doc.id +']').remove();
				displayModule(data.id, change.doc);
			}
		});
	});
	
	//Add event handler to elements created by Javascript
	$('.overlays').find('.remove-overlay').each(function(i){
		$(this).click(function(e){
			var deleteOverlay = confirm("Delete Overlay: Are you sure?");
			if (deleteOverlay){
				removeOverlay($(this).parent().children('.overlay-id').val());
			}
		});
	});
	
	//Function to rename overlays
	$('.overlays').find('.overlay-name').each(function(i){
		$(this).click(function(e){
			var oldName = $(this).text();
			
			$(this).before('<input class="flex-wide" name="overlay-rename-title" type="text" value="' + oldName + '"><button class="btn btn-basic overlay-rename-title"><i class="fas fa-check"></i></button>');
			
			//Rename overlay
			$(this).parent().find('.overlay-rename-title').each(function(){
				$(this).click(function(){
					firebase.firestore().collection("users").doc(uid).collection("overlays").doc($(this).parents('.overlay').data('overlayid')).update({
						name: $(this).parent().children('input[name="overlay-rename-title"]').val()
					}).then(function() {
						console.log("Overlay renamed!");
						
					}).catch(function(error) {
						console.error("Error modifing title: ", error);
					});
				});
			});
			
			
			$(this).remove();
		});
	});
	
	
	//Add event listener to add module
	$('.overlays').find('.add-module').each(function(i){
		$(this).click(function(e){
			var overlayid = $(this).parent().data('overlayid');
			var overlayName = $(this).parent().data('overlayname');
			
			$('#add-module').modal();
			
			$('.module-button').attr('data-overlayid', overlayid);
			$('.module-button').attr('data-overlayname', overlayName);
			
			
		});
	});
}

/*--------------
//Event Listeners
--------------*/
$(document).ready(function(){//Initialize Event Listeners
	var pathname = window.location.pathname
	if(pathname == "/dashboard"){
	
		$('.add-overlay').click(function(){
			addOverlay();
		});

		$('.module-button').click(function(){
			var type = $(this).attr('data-type');
			var overlayid = $(this).attr('data-overlayid');
			var overlayName = $(this).attr('data-overlayname');

			addModule(overlayid, overlayName, type);
		});

		$('.update').click(function(){
			update();
		});

		/*--------------
		//Realtime Event Listener
		--------------*/

		//Overlays
		firebase.firestore().collection('users').doc(uid).collection("overlays").onSnapshot(snapshot => {
			let changes = snapshot.docChanges();
			//console.log(changes);
			changes.forEach(change =>{
				//console.log(change.doc.data());
				if(change.type == 'added'){
					displayOverlay(change.doc);
					//console.log(change.doc);
				} else if (change.type == 'removed'){
					$('.overlay[data-overlayid='+ change.doc.id +']').remove();
				} else if (change.type == 'modified'){
					$('.overlay[data-overlayid='+ change.doc.id +']').remove();
					displayOverlay(change.doc);
				}
			});
		});
	}
});