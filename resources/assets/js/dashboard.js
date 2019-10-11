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

//Update all inputs
function update(){
	
	$('input.updateable').each(function(){
		var overlayid = $(this).parents('.overlay').data('overlayid');
		var moduleid = $(this).parent().data('moduleid');
		var element = $(this).attr('name');
		
		firebase.firestore().collection('users').doc(uid).collection('overlays').doc(overlayid).collection('modules').doc(moduleid).collection('elements').doc(element).set({
				value: $(this).val(),
		}).then(function(){
			console.log(overlayid + " " + moduleid + " " + element + " updated!");
		});
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
				'<h4>' + doc.data().type + '</h4>' +
				'<input type="hidden" class="module-content-end"><br>' +
				'<button class="btn btn-danger remove-module" type="button"><i class="fas fa-trash-alt"></i>&nbsp;Remove Module</button>' +
				'<br class="clear">' +
			'</div>');

		switch(doc.data().type){

			case 'versus'://Versus

				$('.module[data-moduleid=' + doc.id + '] h4').after(
					'<input class="updateable full-width" name="game" list="games-list" placeholder="Select a game">' +
					'<datalist id="games-list">' +
						'<option value="Super Smash Bros. Melee Singles">' +
						'<option value="Super Smash Bros. Melee Doubles">' +
					'</datalist>'
				);

				//if(doc.data())

				$('.overlay-id[value='+ overlayID +']').parent().children('.modules').append(

				);

				break;

			case 'lower-thirds'://Lower-Thirds

				$('.module[data-moduleid=' + doc.id + '] h4').after(
					'<input class="updateable full-width" type="text" name="upperl3d" placeholder="Upper Lower-Third">' +
					'<input class="updateable full-width" type="text" name="lowerl3d" placeholder="Lower Lower-Third">' +
					'<button class="btn takel3d" type="button"><i class="fas fa-camera"></i> Take Overlay</button>'
				);
				
				/*firebase.firestore().collection('users').doc(uid).collection('overlays').doc(overlayID).collection('modules').doc(doc.id).once("status").then(function(snapshot){
					var status = snapshot.val();
					console.log(status);
				});*/
				
				if(doc.data().status == undefined || doc.data().status == false){
					$('.takel3d').removeClass("btn-warning");
				} else if (doc.data().status == true){
					$('.takel3d').addClass("btn-warning");
				}
				
				//Take lower-third function
				
				
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
		}

		doc.ref.collection("elements").get().then(function(elements){
			elements.docs.forEach(function(element){
				if(element.exists){
					//console.log(element.id + ": " + element.data().value);
					$('.module[data-moduleid=' + doc.id + '] input.updateable[name=' + element.id + ']').each(function(){
						
						switch($(this).attr('name')){
						
							default:
							   $(this).val(element.data().value);
							   
							   break;
						}
						
						console.log(doc.id + ", " + $(this).attr('name') + ", " + $(this).val());
					});
				}
			});
		});
		
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
			'<h3 class="overlay-name">' + dataName + '</h3>' +
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
});