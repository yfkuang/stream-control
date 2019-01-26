/*--------------
//Overlays
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
//Module Functions
--------------*/
function addModule(overlayid, type){
	console.log('New module added:' + overlayid + ' ' + type);
	
	// Write new Module to overlay's 'modules' collection
	firebase.firestore().collection('users').doc(uid).collection('overlays').doc(overlayid).collection('modules').doc(type).set({
		type: type,
	});

}

function displayModule(overlayID, overlayName){
	firebase.firestore().collection('users').doc(uid).collection('overlays').doc(overlayID).collection('modules').get().then(function(querySnapshot) {
		querySnapshot.forEach(function(doc){
			if (doc.exists) {
				console.log(overlayName + "module data:", doc.data());

				switch(doc.data().type){

					case 'versus':
						$('.overlay-id[value='+ overlayID +']').parent().children('.modules').append('<p>versus</p>');
						break;
				}

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
	$('.overlays').append('<div class="overlay">' +
						  	'<input class="overlay-id" type="hidden" value="' + data.id + '">' +
						  	'<h3 class="overlay-name">' + data.name + '</h3>' +
						  	'<p><b>Overlay Link:</b> <a href="control.streamland.ca/' + uid + '/' + data.id + '">' + 'control.streamland.ca/' + uid + '/' + data.id + '</a></p>' +
						  	'<div class="modules"></div>' +
						  	'<button class="btn btn-primary add-module" type="button" data-toggle="modal" data-target="#add-module"><i class="fas fa-plus-circle"></i> Add Module</button>' +
						  	'<button class="btn btn-danger remove-overlay" type="button"><i class="fas fa-trash-alt"></i> Remove Overlay</button>' +
						  '</div>');
	
	displayModule(data.id);
	
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
			var overlayid = $(this).parent().children('.overlay-id').val();
			
			$('#add-module').modal();
			
			$('.module-button').attr('data-overlayid', overlayid);
			
			
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
	
		addModule(overlayid,type);
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