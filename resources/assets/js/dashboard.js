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

//Update goddamn everything
function update(){
	console.log("Overlay updated!");
	
	$('.overlay').each(function(){
		var overlayid = $(this).children('.overlay-id').val();
		console.log("Updating" + overlayid);
		
		$('.module').each(function(){
			var type = $(this).data('type');
			
			switch (type) {
				
				case 'versus'://Versus
					console.log("Updating" + overlayid + " " + type);
					firebase.firestore().collection('users').doc(uid).collection('overlays').doc(overlayid).collection('modules').doc(type).set({
						type: type,
						playerLeftTag: $('.playerLeftTag').val(),
					}); //Player Left
					break;


			//Casters
			}
		});
	});
}

/*--------------
//Module Functions
--------------*/
function addModule(overlayid, overlayName, type){
	console.log('New module added:' + overlayid + ' ' + overlayName + ' ' + type);
	
	// Write new Module to overlay's 'modules' collection
	firebase.firestore().collection('users').doc(uid).collection('overlays').doc(overlayid).collection('modules').doc(type).set({
		type: type,
	});

}

function removeModule(overlayid,moduleType){
	firebase.firestore().collection("users").doc(uid).collection("overlays").doc(overlayid).collection('modules').doc(moduleType).delete().then(function() {
		console.log("Module deleted!");
	}).catch(function(error) {
		console.error("Error removing document: ", error);
	});
	
	/*Add delete modules afterwards*/
}

function displayModule(overlayID, overlayName){
	firebase.firestore().collection('users').doc(uid).collection('overlays').doc(overlayID).collection('modules').get().then(function(querySnapshot) {
		querySnapshot.forEach(function(doc){
			if (doc.exists) {
				console.log(overlayName + " module data:", doc.data());

				switch(doc.data().type){

					case 'versus'://Versus
						$('.overlay-id[value='+ overlayID +']').parent().children('.modules').append(
							'<div class="module" data-type="' + doc.data().type + '">' +
								'<h4>' + doc.data().type + '</h4>' +
								'<div class="playerLeft">' +
									'<input type="text" class="playerLeftTag" placeholder="Player Left">' +
								'</div>' +
								'<button class="btn btn-danger remove-module" type="button"><i class="fas fa-trash-alt"></i> Remove Module</button>' +
							'</div>'
						);
						break;
				}
				
				//Add event handler to remove module
				$('.modules').find('.remove-module').each(function(i){
					$(this).click(function(e){
						removeModule($(this).parent().parent().parent().children('.overlay-id').val(), $(this).parent().data("type"));
					});
				});

			} else {
				// doc.data() will be undefined in this case
				console.log("No modules!");
			}
		});
	}).catch(function(error) {
		console.log("Error getting modules:", error);
	});
	
	
}

/*--------------
//Overlay Functions
--------------*/
function addOverlay(){
	console.log('New overlay added');
	var newOverlay = makeid();
	firebase.firestore().collection('users').doc(uid).collection('overlays').doc(newOverlay).set({
		id: newOverlay,
		name: "New Overlay"
	});
}

function removeOverlay(overlayid){
	firebase.firestore().collection("users").doc(uid).collection("overlays").doc(overlayid).delete().then(function() {
		console.log("Overlay deleted!");
	}).catch(function(error) {
		console.error("Error removing document: ", error);
	});
	
	/*Add delete modules afterwards*/
}

function displayOverlay(data){
	$('.overlays').append('<div class="overlay" data-overlayid="' + data.id + '" data-overlayname="' + data.name + '">' +
						  	'<input class="overlay-id" type="hidden" value="' + data.id + '">' +
						  	'<h3 class="overlay-name">' + data.name + '</h3>' +
						  	'<p><b>Overlay Link:</b> <a href="http://control.streamland.ca/' + uid + '/' + data.id + '">' + 'control.streamland.ca/' + uid + '/' + data.id + '</a></p>' +
						  	'<div class="modules"></div>' +
						  	'<button class="btn btn-primary add-module" type="button" data-toggle="modal" data-target="#add-module"><i class="fas fa-plus-circle"></i> Add Module</button>' +
						  	'<button class="btn btn-danger remove-overlay" type="button"><i class="fas fa-trash-alt"></i> Remove Overlay</button>' +
						  '</div>');
	
	//Add and listen to modules
	displayModule(data.id, data.name);
	/*firebase.firestore().collection('users').doc(uid).collection("overlays").doc(data.id).collection("modules").onSnapshot(function(querySnapshot) {
		$('.module').remove();
		querySnapshot.forEach(function(doc){
			displayModule(doc.data().id);
		});
	});*/
	
	//Add event handler to elements created by Javascript
	$('.overlays').find('.remove-overlay').each(function(i){
		$(this).click(function(e){
			removeOverlay($(this).parent().children('.overlay-id').val());
		});
	});
	
	//Function to rename overlays
	$('.overlays').find('.overlay-name').each(function(i){
		$(this).click(function(e){
			var oldName = $(this).text();
			
			$(this).before('<input name="overlay-rename-title" type="text" value="' + oldName + '"><button class="btn btn-basic overlay-rename-title"><i class="fas fa-check"></i></button>');
			
			//Rename overlay
			$(this).parent().find('.overlay-rename-title').each(function(i){
				$(this).click(function(){
					firebase.firestore().collection("users").doc(uid).collection("overlays").doc($(this).parent().children('.overlay-id').val()).update({
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

	firebase.firestore().collection('users').doc(uid).collection("overlays").onSnapshot(function(querySnapshot) {
		$('.overlay').remove();
		querySnapshot.forEach(function(doc){
			displayOverlay(doc.data());
		});
	});
});