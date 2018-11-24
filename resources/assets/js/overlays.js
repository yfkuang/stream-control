/*--------------
//Pages
--------------*/
var uid = $('meta[name="uid"]').attr('data');

function makeid() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 10; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
	
  return text;
}

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
						  	'<button class="btn btn-primary add-module" type="button"><i class="fas fa-plus-circle"></i> Add Module</button>' +
						  	'<button class="btn btn-danger remove-overlay" type="button"><i class="fas fa-trash-alt"></i> Remove Overlay</button>' +
						  '</div>');
	
	//Add event handler to elements created by Javascript
	$('.overlays').find('.remove-overlay').each(function(i){
		$(this).click(function(e){
			removeOverlay($(this).parent().children('.overlay-id').val());
		});
	});
	
	$('.overlays').find('.overlay-name').each(function(i){
		$(this).click(function(e){
			$(this).before('<input name="overlay-rename-title" type="text" value="' + $(this).text() + '"><button class="btn btn-basic overlay-rename-title"><i class="fas fa-check"></i></button>');
			
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
}

$(document).ready(function(){//Initialize Event Listeners
	
	$('.add-overlay').click(function(){
		addOverlay();
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