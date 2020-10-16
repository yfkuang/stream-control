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

//Upload Media
$('#upload-button').change(function(){
	//Get files
	var file = this.files[0];
	
	//Create a storage ref
	var storageRef = firebase.storage().ref('user_data/' + uid + '/' + file.name);
	
	//upload file
	var media = storageRef.put(file);
	
	//Progress bar
	media.on('state_changed', function progress (snapshot){
		var percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
		$('#upload-progress').val(percentage);
		$('#upload-text').text(percentage + "%");
	}, function error(err){
		console.log("Upload error: " + err);
	}, function complete(){
		$('#upload-text').text("Upload Complete");
		console.log(file.name + " uploaded");
		listMediaUpload();
	});
});

//Delete Media
function deleteMedia(reference) {
	reference.delete().then(function() {
		console.log("Media file " + reference.name + " deleted");
		listMediaUpload();
	}).catch(function(error) {
	  console.log("Error deleting " + reference.name + " from storage: " + error);
	});
	
}

//List Media
function listMediaUpload(){
	// Find all the prefixes and items.
	$('#media-list').empty();
	
	firebase.storage().ref('user_data/' + uid).listAll().then(function(result) {
		result.items.forEach(function(item){
			//console.log(item.getDownloadURL());
			
			//Get URL
			item.getDownloadURL().then(function(url) {
				$('#media-list').append('<tr class="flex-container full-width"><td><a target="_blank" href="' + url + '" class="btn btn-primary"><i class="fas fa-eye"></i></a></td><td class="flex-wide">&nbsp;' + item.name + '</td><td><button class="btn btn-danger btn-media-delete" data-fullpath="' + item.fullPath + '" type="button"><i class="fas fa-trash"></i></button></td></tr>');
				
				//Event Listener for Delete Media 
				$('.btn-media-delete[data-fullpath="' + item.fullPath + '"]').click(function(){
					//console.log(item.fullPath);
					deleteMedia(item);
				});

				
			}).catch(function(error) {
				console.log("Error retrieving from storage: " + error);
			});
		});
	}).catch(function(error) {
		console.log("Storage retrieval error: " + error);
	});
	
}

//List Media Event Listener
$('.media').click(function(){
	listMediaUpload();
});

//Copy to clipboard
function listenCopyClip(overlayid){
	$(".copy-clip").each(function(){
		$(this).click(function(){
			var temp = $("<input>");
			$("body").append(temp);
			temp.val($(".overlay[data-overlayid=" + overlayid + "] .link").attr('href')).select();
			document.execCommand("copy");
			console.log(overlayid + " URL copied to clipboard!");
			temp.remove();
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
				
				$('#user-uploads').empty();
				
				//List user uploads
				firebase.storage().ref('user_data/' + uid).listAll().then(function(result) {
					result.items.forEach(function(item){
						//console.log(item.fullPath);
						$('#user-uploads').append('<option value="' + item.fullPath + '">' + item.name + "</option>");
					});
				}).catch(function(error) {
					console.log("Storage retrieval error: " + error);
				});
				
				//Load in previous settings
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
				
				//List user uploads
				firebase.storage().ref('user_data/' + uid).listAll().then(function(result) {
					result.items.forEach(function(item){
						//console.log(item.fullPath);
						$('#user-uploads').append('<option value="' + item.fullPath + '">' + item.name + "</option>");
					});
				}).catch(function(error) {
					console.log("Storage retrieval error: " + error);
				});
				
				//Load in previous settings
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

//Listen Switch Button
function listenSwitch(moduleid) {
	//console.log("added switches for" + moduleid)
	$('.module[data-moduleid=' + moduleid + '] .switch').each(function() {
		//console.log($(this));
		
		$(this).click(function(){
			//console.log('test');
			var target1 = $(this).attr('data-target1');
			var target2 = $(this).attr('data-target2');
			var target1Value = $('.module[data-moduleid=' + moduleid + '] .updateable[name=' + target1 + ']').val();
			var target2Value = $('.module[data-moduleid=' + moduleid + '] .updateable[name=' + target2 + ']').val();

			$('.module[data-moduleid=' + moduleid + '] .updateable[name=' + target1 + ']').val(target2Value);
			$('.module[data-moduleid=' + moduleid + '] .updateable[name=' + target2 + ']').val(target1Value);

			console.log('Switched ' + target1 + " and " + target2);
		});
	});
}

//Listen add and minus name count Button for head-to-head
function listenNameCount(overlayid, module) {
	$('.addNameCount').each(function() {
		$(this).click(function(){
			newNameCount = module.data().nameCount + 1;
			
			firebase.firestore().collection('users').doc(uid).collection('overlays').doc(overlayid).collection('modules').doc(module.id).update({
				nameCount: newNameCount,
			}).then(function(){
				console.log('Added Names to ' + module.id + '. Name Count: ' + newNameCount);
			});
			
		});
	});
	
	$('.minusNameCount').each(function() {//decrease name count
		$(this).click(function(){
			if(module.data().nameCount > 0) {
				newNameCount = module.data().nameCount - 1;
			
				firebase.firestore().collection('users').doc(uid).collection('overlays').doc(overlayid).collection('modules').doc(module.id).update({
					nameCount: newNameCount,
				}).then(function(){
					console.log('Removed Names to ' + module.id + '. Name Count: ' + newNameCount);
				});
			}
			
		});
	});
}

//Reset Winning deck for hearthstone pick and ban
function listenResetPickAndBan() {
	$('.resetPickBan').each(function() {
		radioButton = $('input[name=' + $(this).attr('data-target') + ']');
		radioButton.attr('checked',false);
		console.log('radio test');
	});
}

/*--------------
//Module Functions
--------------*/
function addModule(overlayid, overlayName, type){
	var newModule = makeid() + '-' + type;
	console.log('New module added to ' + overlayid + ' (' + overlayName + '): ' + newModule);
	
	switch(type){
		case 'head-to-head':
			// Write new Module to overlay's 'modules' collection
			firebase.firestore().collection('users').doc(uid).collection('overlays').doc(overlayid).collection('modules').doc(newModule).set({
				type: type,
				nameCount: 1,
			});
			break;
		default:
			// Write new Module to overlay's 'modules' collection
			firebase.firestore().collection('users').doc(uid).collection('overlays').doc(overlayid).collection('modules').doc(newModule).set({
				type: type,
			});
			break;
	}
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
						'<option value="Generic">' +
						'<option value="EA NHL">' +
						'<option value="FGC">' +
						'<option value="Overwatch">' +
						'<option value="OPSE">' +
						'<option value="OPSE Hearthstone">' +
						'<option value="OPSE Rocket League">' +
						'<option value="Pokken">' +
						'<option value="Super Smash Bros. Melee Singles">' +
						'<option value="Super Smash Bros. Melee Doubles">' +
						'<option value="Super Smash Bros. Melee Crews">' +
						'<option value="Super Smash Bros. Ultimate Singles">' +
						'<option value="Super Smash Bros. Ultimate Doubles">' +
						'<option value="Super Smash Bros. Ultimate Crews/Squad Strike">' +
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
						'<button class="btn btn-light element-settings-button" data-element="text" type="button" data-toggle="modal" data-target="#element-settings"><i class="fas fa-cog"></i></button>' +
						'<input class="updateable flex-wide" type="text" name="text" placeholder="Text">' +
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
						'<button class="btn btn-primary switch" data-target1="casterTag1" data-target2="casterTag2" type="button"><i class="fas fa-exchange-alt"></i></button>' +
						'<div class="flex-container flex-wide">' +
							'<button class="btn btn-light element-settings-button" data-element="casterTag2" type="button" data-toggle="modal" data-target="#element-settings"><i class="fas fa-cog"></i></button>' +
							'<input class="updateable flex-wide" type="text" name="casterTag2" placeholder="Caster Tag">' +
						'</div>' +
						'<button class="btn btn-primary switch" data-target1="casterTag2" data-target2="casterTag3" type="button"><i class="fas fa-exchange-alt"></i></button>' +
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
						'<button class="btn btn-primary switch" data-target1="casterTwitter1" data-target2="casterTwitter2" type="button"><i class="fas fa-exchange-alt"></i></button>' +
						'<div class="flex-container flex-wide">' +
							'<button class="btn btn-light element-settings-button" data-element="casterTwitter2" type="button" data-toggle="modal" data-target="#element-settings"><i class="fas fa-cog"></i></button>' +
							'<input class="updateable flex-wide" type="text" name="casterTwitter2" placeholder="Caster Twitter">' +
						'</div>' +
						'<button class="btn btn-primary switch" data-target1="casterTwitter2" data-target2="casterTwitter3" type="button"><i class="fas fa-exchange-alt"></i></button>' +
						'<div class="flex-container flex-wide">' +
							'<button class="btn btn-light element-settings-button" data-element="casterTwitter3" type="button" data-toggle="modal" data-target="#element-settings"><i class="fas fa-cog"></i></button>' +
							'<input class="updateable flex-wide" type="text" name="casterTwitter3" placeholder="Caster Twitter">' +
						'</div>' +
					'</div>'
				);
				
				listenElementSettings(doc.id);
				
				break;
				
			case 'timer'://Timer
				$('.module[data-moduleid=' + doc.id + '] h4').after(
					'<div class="flex-container full-width">' +
						'<label>Text After Timer Ends</label>' +
						'<button class="btn btn-light element-settings-button" data-element="startingText" type="button" data-toggle="modal" data-target="#element-settings"><i class="fas fa-cog"></i></button>' +
						'<input class="updateable flex-wide" type="text" name="startingText" placeholder="Text After Timer Ends">' +
					'</div>' +
					'<div class="flex-container full-width">' +
						'<label>Time in Minutes</label>' +
						'<button class="btn btn-light element-settings-button" data-element="timer" type="button" data-toggle="modal" data-target="#element-settings"><i class="fas fa-cog"></i></button>' +
						'<input class="updateable flex-wide" type="number" name="timer" placeholder="Time in minutes">' +
					'</div>'
				);
				
				listenElementSettings(doc.id);
				
				break;
				
			case 'head-to-head'://Head-to-head
				$('.module[data-moduleid=' + doc.id + '] h4').after(
					'<div class="flex-container flex-center full-width ">' + //School Logo
						'<button class="btn btn-light element-settings-button" data-element="charLeft-img" type="button" data-toggle="modal" data-target="#element-settings"><i class="fas fa-cog"></i></button>' +
						'<button class="btn btn-light toggle-hide" type="button" data-element="charLeft-img"><i class="fas fa-eye"></i></i></button>' +
						'<img class="dynamic-image melee-char" data-target="charLeft-img">' +
						'<input class="updateable flex-wide dynamic-image-target" list="opse_schools" data-storage-ref="opse_schools" name="charLeft-img">' +
						'<button class="btn btn-primary switch" data-target1="charLeft-img" data-target2="charRight-img" type="button"><i class="fas fa-exchange-alt"></i></button>' +
						'<input class="updateable flex-wide dynamic-image-target" list="opse_schools" data-storage-ref="opse_schools" name="charRight-img">' +
						'<img class="dynamic-image melee-char" data-target="charRight-img">' +
						'<button class="btn btn-light toggle-hide" type="button" data-element="charRight-img"><i class="fas fa-eye"></i></i></button>' +
						'<button class="btn btn-light element-settings-button" data-element="charRight-img" type="button" data-toggle="modal" data-target="#element-settings"><i class="fas fa-cog"></i></button>' +
					'</div>'
				);
				
				for(i = 0; i < doc.data().nameCount; i++){
					$('.module[data-moduleid=' + doc.id + '] .module-content-end').before(
					'<div class="flex-container full-width ">' + //Player tag
						'<button class="btn btn-light element-settings-button" data-element="h2h-playerLeft-' + i + '" type="button" data-toggle="modal" data-target="#element-settings"><i class="fas fa-cog"></i></button>' +
						'<button class="btn btn-light toggle-hide" type="button" data-element="h2h-playerLeft-' + i + '"><i class="fas fa-eye"></i></i></button>' +
						'<input class="updateable flex-wide" type="text" name="h2h-playerLeft-' + i + '" placeholder="Left Player Tag ' + i + '">' +
						'<button class="btn btn-primary switch" data-target1="h2h-playerLeft-' + i + '" data-target2="h2h-playerRight-' + i + '" type="button"><i class="fas fa-exchange-alt"></i></button>' +
						'<input class="updateable flex-wide" type="text" name="h2h-playerRight-' + i + '" placeholder="Right Player Tag ' + i + '">' +
						'<button class="btn btn-light toggle-hide" type="button" data-element="h2h-playerRight-' + i + '"><i class="fas fa-eye"></i></i></button>' +
						'<button class="btn btn-light element-settings-button" data-element="h2h-playerRight-' + i + '" type="button" data-toggle="modal" data-target="#element-settings"><i class="fas fa-cog"></i></button>' +
					'</div>'
					);
				}
				
				$('.module[data-moduleid=' + doc.id + '] .module-content-end').before(
				'<div class="flex-container full-width flex-center">' + //Increase Count
					'<button class="btn btn-success addNameCount" type="button"><i class="fas fa-plus"></i></button>' +
					'<button class="btn btn-danger minusNameCount" type="button"><i class="fas fa-minus"></i></button>' +
				'</div>'
				);
				
				listenNameCount(overlayID, doc);
				listenElementSettings(doc.id);
				
				//listen to switch buttons
				listenSwitch(doc.id);
				
				break;
			
			case 'hearthstone-ban-and-pick'://Ban and Pick
				$('.module[data-moduleid=' + doc.id + '] h4').after(
					'<div class="flex-container full-width flex-center">' +
						'<h5>Picks</h5>' +
					'</div>' +
					'<div class="flex-container full-width ">' + //Class Logo
						'<button class="btn btn-light element-settings-button" data-element="pickLeft-img-1" type="button" data-toggle="modal" data-target="#element-settings"><i class="fas fa-cog"></i></button>' +
						'<button class="btn btn-light toggle-hide" type="button" data-element="pickLeft-img-1"><i class="fas fa-eye"></i></i></button>' +
						'<img class="dynamic-image melee-char" data-target="pickLeft-img-1">' +
						'<input class="updateable flex-wide dynamic-image-target" list="hearthstone_classes" data-storage-ref="hearthstone_classes" name="pickLeft-img-1">' +
						'<button class="btn btn-primary switch" data-target1="pickLeft-img-1" data-target2="pickRight-img-1" type="button"><i class="fas fa-exchange-alt"></i></button>' +
						'<input class="updateable flex-wide dynamic-image-target" list="hearthstone_classes" data-storage-ref="hearthstone_classes" name="pickRight-img-1">' +
						'<img class="dynamic-image melee-class" data-target="pickRight-img-1">' +
						'<button class="btn btn-light toggle-hide" type="button" data-element="pickRight-img-1"><i class="fas fa-eye"></i></i></button>' +
						'<button class="btn btn-light element-settings-button" data-element="pickRight-img-1" type="button" data-toggle="modal" data-target="#element-settings"><i class="fas fa-cog"></i></button>' +
					'</div>' +
					'<div class="flex-container full-width flex-center">' + //win
						'<input type="radio" class="updateable" name="pick-win-1" value="right">' +
						'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Winning Deck?&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' +
						'<input type="radio" class="updateable" name="pick-win-1" value="left">' +
					'</div>' +
					'<div class="flex-container full-width ">' + //Class Logo
						'<button class="btn btn-light element-settings-button" data-element="pickLeft-img-2" type="button" data-toggle="modal" data-target="#element-settings"><i class="fas fa-cog"></i></button>' +
						'<button class="btn btn-light toggle-hide" type="button" data-element="pickLeft-img-2"><i class="fas fa-eye"></i></i></button>' +
						'<img class="dynamic-image melee-char" data-target="pickLeft-img-2">' +
						'<input class="updateable flex-wide dynamic-image-target" list="hearthstone_classes" data-storage-ref="hearthstone_classes" name="pickLeft-img-2">' +
						'<button class="btn btn-primary switch" data-target1="pickLeft-img-2" data-target2="pickRight-img-2" type="button"><i class="fas fa-exchange-alt"></i></button>' +
						'<input class="updateable flex-wide dynamic-image-target" list="hearthstone_classes" data-storage-ref="hearthstone_classes" name="pickRight-img-2">' +
						'<img class="dynamic-image melee-class" data-target="pickRight-img-2">' +
						'<button class="btn btn-light toggle-hide" type="button" data-element="pickRight-img-2"><i class="fas fa-eye"></i></i></button>' +
						'<button class="btn btn-light element-settings-button" data-element="pickRight-img-2" type="button" data-toggle="modal" data-target="#element-settings"><i class="fas fa-cog"></i></button>' +
					'</div>' +
					'<div class="flex-container full-width flex-center">' + //win
						'<input type="radio" class="updateable" name="pick-win-2" value="left">' +
						'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Winning Deck?&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' +
						'<input type="radio" class="updateable" name="pick-win-2" value="right">' +
					'</div>' +
					'<div class="flex-container full-width flex-center">' +
						"<input class='btn btn-light resetPickBan' type='button' value='Reset' data-target='pick-win-2'>" +
					'</div>' +
					'<div class="flex-container full-width ">' + //Class Logo
						'<button class="btn btn-light element-settings-button" data-element="pickLeft-img-3" type="button" data-toggle="modal" data-target="#element-settings"><i class="fas fa-cog"></i></button>' +
						'<button class="btn btn-light toggle-hide" type="button" data-element="pickLeft-img-3"><i class="fas fa-eye"></i></i></button>' +
						'<img class="dynamic-image melee-char" data-target="pickLeft-img-3">' +
						'<input class="updateable flex-wide dynamic-image-target" list="hearthstone_classes" data-storage-ref="hearthstone_classes" name="pickLeft-img-3">' +
						'<button class="btn btn-primary switch" data-target1="pickLeft-img-3" data-target2="pickRight-img-3" type="button"><i class="fas fa-exchange-alt"></i></button>' +
						'<input class="updateable flex-wide dynamic-image-target" list="hearthstone_classes" data-storage-ref="hearthstone_classes" name="pickRight-img-3">' +
						'<img class="dynamic-image melee-class" data-target="pickRight-img-3">' +
						'<button class="btn btn-light toggle-hide" type="button" data-element="pickRight-img-3"><i class="fas fa-eye"></i></i></button>' +
						'<button class="btn btn-light element-settings-button" data-element="pickRight-img-3" type="button" data-toggle="modal" data-target="#element-settings"><i class="fas fa-cog"></i></button>' +
					'</div>' +
					'<div class="flex-container full-width flex-center">' + //win
						'<input type="radio" class="updateable" name="pick-win-3" value="left">' +
						'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Winning Deck?&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' +
						'<input type="radio" class="updateable" name="pick-win-3" value="right">' +
					'</div>' +
					'<div class="flex-container full-width flex-center">' +
						'<h5>Bans</h5>' +
					'</div>' +
					'<div class="flex-container full-width ">' + //Class Logo
						'<button class="btn btn-light element-settings-button" data-element="banLeft-img" type="button" data-toggle="modal" data-target="#element-settings"><i class="fas fa-cog"></i></button>' +
						'<button class="btn btn-light toggle-hide" type="button" data-element="banLeft-img"><i class="fas fa-eye"></i></i></button>' +
						'<img class="dynamic-image melee-char" data-target="banLeft-img">' +
						'<input class="updateable flex-wide dynamic-image-target" list="hearthstone_classes" data-storage-ref="hearthstone_classes" name="banLeft-img">' +
						'<button class="btn btn-primary switch" data-target1="banLeft-img" data-target2="banRight-img" type="button"><i class="fas fa-exchange-alt"></i></button>' +
						'<input class="updateable flex-wide dynamic-image-target" list="hearthstone_classes" data-storage-ref="hearthstone_classes" name="banRight-img">' +
						'<img class="dynamic-image melee-class" data-target="banRight-img">' +
						'<button class="btn btn-light toggle-hide" type="button" data-element="banRight-img"><i class="fas fa-eye"></i></i></button>' +
						'<button class="btn btn-light element-settings-button" data-element="banRight-img" type="button" data-toggle="modal" data-target="#element-settings"><i class="fas fa-cog"></i></button>' +
					'</div>'
				);
				
				//listen reset pick ban buttons
				listenResetPickAndBan();
				
				//listen to switch buttons
				listenSwitch(doc.id);
				
				listenElementSettings(doc.id);
				
				break;
				
			case 'image'://Image
				$('.module[data-moduleid=' + doc.id + '] h4').after(
					'<input class="updateable full-width" name="imageType" list="image-type-list" placeholder="Select an image category">' +
					'<datalist id="image-type-list">' +
						'<option value="User Media">' +
						'<option value="melee-char">Super Smash Bros. Melee Characters</option>' +
						'<option value="opse_schools">OPSE Schools</option>' +
						'<option value="hearthstone_classes">Hearthstone Classes</option>' +
						'<option value="lol_positions">League of Legends Positions</option>' +
					'</datalist>'
				);
				
				//display appropriate inputs on list value (image-type) change
				$('.module[data-moduleid=' + doc.id + '] .updateable[name=imageType]').change(function(){
					var imageType = $(this).val();
					
					console.log(doc.id + " image type changed to " + imageType);
					$('.module[data-moduleid=' + doc.id + ']  .imageType').remove();
					
					displayImageType(overlayID, doc, imageType);
				});
				
				break;
		}
		
		//listen to element settings buttons
		//listenElementSettings();
		
		//listen to toggleable elements
		listenToggle(overlayID, doc);
		
		//Get data from database E.g. previous session
		displayData(overlayID, doc);
		
		//Add event handler to remove module
		$('.modules').find('.remove-module').each(function(){
			$(this).click(function(){
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
							case 'imageType':
								$(this).val(element.data().value);
								displayImageType(overlayID, doc, element.data().value);
								
								break;
								
							default:
							   $(this).val(element.data().value);
							   
							   break;
						}
						
						//Display Dynamic Images
						$('.module[data-moduleid=' + doc.id + '] .dynamic-image-target').each(function(){
							var imageRef = $(this).val();
							var storageRef = $(this).attr('data-storage-ref');
							var target = $(this).attr('name');

							displayImages(doc.id,target,storageRef,imageRef);
						});
						
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

//Function for getting dynamic images in Firebase storage
function displayImages(moduleid, target, storageRef, imageRef){
	$('.module[data-moduleid=' + moduleid +'] .dynamic-image[data-target=' + target + ']').each(function() {
		var img = $(this);
		
		firebase.storage().ref(storageRef + '/' + imageRef + '.png').getDownloadURL().then(function(url) {
			img.attr('src', url);
		}).catch(function(error) {
			console.log("Error retrieving from storage: " + error);
		});
	});
}

//Function for displaying appropriate inputs on list value (game category) change
function displayVersus(overlayID, module, game){

	switch(game){
		case "Generic":
			
			$('.overlay[data-overlayid=' + overlayID + '] .module[data-moduleid=' + module.id + '] .updateable[name=game]').after(
				'<div class="game" >' +
					'<div class="flex-container full-width ">' +
						'<button class="btn btn-light element-settings-button" data-element="gnrc-playerLeft" type="button" data-toggle="modal" data-target="#element-settings"><i class="fas fa-cog"></i></button>' +
						'<button class="btn btn-light toggle-hide" type="button" data-element="gnrc-playerLeft"><i class="fas fa-eye"></i></i></button>' +
						'<input class="updateable flex-wide" type="text" name="gnrc-playerLeft" placeholder="Left Player Name">' +
						'<button class="btn btn-primary switch" data-target1="gnrc-playerLeft" data-target2="gnrc-playerRight" type="button"><i class="fas fa-exchange-alt"></i></button>' +
						'<input class="updateable flex-wide" type="text" name="gnrc-playerRight" placeholder="Right Player Name">' +
						'<button class="btn btn-light toggle-hide" type="button" data-element="gnrc-playerRight"><i class="fas fa-eye"></i></i></button>' +
						'<button class="btn btn-light element-settings-button" data-element="gnrc-playerRight" type="button" data-toggle="modal" data-target="#element-settings"><i class="fas fa-cog"></i></button>' +
					'</div>' +
					'<div class="flex-container flex-center full-width ">' +
						'<button class="btn btn-light element-settings-button" data-element="gnrc-scoreLeft" type="button" data-toggle="modal" data-target="#element-settings"><i class="fas fa-cog"></i></button>' +
						'<button class="btn btn-light toggle-hide" type="button" data-element="gnrc-scoreLeft"><i class="fas fa-eye"></i></i></button>' +
						'<input class="updateable" type="number" name="gnrc-scoreLeft" size="2" value="0" min="0">' +
						'<button class="btn btn-primary switch" data-target1="gnrc-scoreLeft" data-target2="gnrc-scoreRight" type="button"><i class="fas fa-exchange-alt"></i></button>' +
						'<input class="updateable" type="number" name="gnrc-scoreRight" size="2" value="0" min="0">' +
						'<button class="btn btn-light toggle-hide" type="button" data-element="gnrc-scoreRight"><i class="fas fa-eye"></i></i></button>' +
						'<button class="btn btn-light element-settings-button" data-element="gnrc-scoreRight" type="button" data-toggle="modal" data-target="#element-settings"><i class="fas fa-cog"></i></button>' +
					'</div>' +
				'</div>'
			);
			
			break;
			
		case 'Super Smash Bros. Melee Singles':
			//console.log("test");
			$('.overlay[data-overlayid=' + overlayID + '] .module[data-moduleid=' + module.id + '] .updateable[name=game]').after(
				'<div class="game" >' +
					'<div class="flex-container full-width ">' + //Sponsors
						'<button class="btn btn-light element-settings-button" data-element="melee-singles-sponsorLeft" type="button" data-toggle="modal" data-target="#element-settings"><i class="fas fa-cog"></i></button>' +
						'<button class="btn btn-light toggle-hide" type="button" data-element="melee-singles-sponsorLeft"><i class="fas fa-eye"></i></i></button>' +
						'<input class="updateable flex-wide" type="text" name="melee-singles-sponsorLeft" placeholder="Left Player Sponsor">' +
						'<button class="btn btn-primary switch" data-target1="melee-singles-sponsorLeft" data-target2="melee-singles-sponsorRight" type="button"><i class="fas fa-exchange-alt"></i></button>' +
						'<input class="updateable flex-wide" type="text" name="melee-singles-sponsorRight" placeholder="Right Player Sponsor">' +
						'<button class="btn btn-light toggle-hide" type="button" data-element="melee-singles-sponsorRight"><i class="fas fa-eye"></i></i></button>' +
						'<button class="btn btn-light element-settings-button" data-element="melee-singles-sponsorRight" type="button" data-toggle="modal" data-target="#element-settings"><i class="fas fa-cog"></i></button>' +
					'</div>' +
					'<div class="flex-container full-width ">' + //Player Tags
						'<button class="btn btn-light element-settings-button" data-element="melee-singles-playerLeft" type="button" data-toggle="modal" data-target="#element-settings"><i class="fas fa-cog"></i></button>' +
						'<button class="btn btn-light toggle-hide" type="button" data-element="melee-singles-playerLeft"><i class="fas fa-eye"></i></i></button>' +
						'<input class="updateable flex-wide" type="text" name="melee-singles-playerLeft" placeholder="Left Player Tag">' +
						'<button class="btn btn-primary switch" data-target1="melee-singles-playerLeft" data-target2="melee-singles-playerRight" type="button"><i class="fas fa-exchange-alt"></i></button>' +
						'<input class="updateable flex-wide" type="text" name="melee-singles-playerRight" placeholder="Right Player Tag">' +
						'<button class="btn btn-light toggle-hide" type="button" data-element="melee-singles-playerRight"><i class="fas fa-eye"></i></i></button>' +
						'<button class="btn btn-light element-settings-button" data-element="melee-singles-playerRight" type="button" data-toggle="modal" data-target="#element-settings"><i class="fas fa-cog"></i></button>' +
					'</div>' +
					'<div class="flex-container flex-center full-width ">' + //Characters
						'<button class="btn btn-light element-settings-button" data-element="melee-singles-charLeft-img" type="button" data-toggle="modal" data-target="#element-settings"><i class="fas fa-cog"></i></button>' +
						'<button class="btn btn-light toggle-hide" type="button" data-element="melee-singles-charLeft-img"><i class="fas fa-eye"></i></i></button>' +
						'<img class="dynamic-image melee-char" data-target="melee-singles-charLeft-img">' +
						'<input class="updateable flex-wide dynamic-image-target" list="melee-char" data-storage-ref="melee-char" name="melee-singles-charLeft-img">' +
						'<button class="btn btn-primary switch" data-target1="melee-singles-charLeft-img" data-target2="melee-singles-charRight-img" type="button"><i class="fas fa-exchange-alt"></i></button>' +
						'<input class="updateable flex-wide dynamic-image-target" list="melee-char" data-storage-ref="melee-char" name="melee-singles-charRight-img">' +
						'<img class="dynamic-image melee-char" data-target="melee-singles-charRight-img">' +
						'<button class="btn btn-light toggle-hide" type="button" data-element="melee-singles-charRight-img"><i class="fas fa-eye"></i></i></button>' +
						'<button class="btn btn-light element-settings-button" data-element="melee-singles-charRight-img" type="button" data-toggle="modal" data-target="#element-settings"><i class="fas fa-cog"></i></button>' +
					'</div>' +
					'<div class="flex-container flex-center full-width ">' + //Port
						'<button class="btn btn-light element-settings-button" data-element="melee-singles-portLeft" type="button" data-toggle="modal" data-target="#element-settings"><i class="fas fa-cog"></i></button>' +
						'<button class="btn btn-light toggle-hide" type="button" data-element="melee-singles-portLeft"><i class="fas fa-eye"></i></i></button>' +
						'<label>Port</label>' +
						'<input class="updateable" type="number" name="melee-singles-portLeft" size="2" value="0" min="1" max="4">' +
						'<button class="btn btn-primary switch" data-target1="melee-singles-portLeft" data-target2="melee-singles-portRight" type="button"><i class="fas fa-exchange-alt"></i></button>' +
						'<input class="updateable" type="number" name="melee-singles-portRight" size="2" value="1" min="1" max="4">' +
						'<label>Port</label>' +
						'<button class="btn btn-light toggle-hide" type="button" data-element="melee-singles-portRight"><i class="fas fa-eye"></i></i></button>' +
						'<button class="btn btn-light element-settings-button" data-element="melee-singles-portRight" type="button" data-toggle="modal" data-target="#element-settings"><i class="fas fa-cog"></i></button>' +
					'</div>' +
					'<div class="flex-container flex-center full-width ">' + //Score
						'<button class="btn btn-light element-settings-button" data-element="melee-singles-scoreLeft" type="button" data-toggle="modal" data-target="#element-settings"><i class="fas fa-cog"></i></button>' +
						'<button class="btn btn-light toggle-hide" type="button" data-element="melee-singles-scoreLeft"><i class="fas fa-eye"></i></i></button>' +
						'<label>Score</label>' +
						'<input class="updateable" type="number" name="melee-singles-scoreLeft" size="2" value="1" min="0" max="2">' +
						'<button class="btn btn-primary switch" data-target1="melee-singles-scoreLeft" data-target2="melee-singles-scoreRight" type="button"><i class="fas fa-exchange-alt"></i></button>' +
						'<input class="updateable" type="number" name="melee-singles-scoreRight" size="2" value="0" min="0" max="2">' +
						'<label>Score</label>' +
						'<button class="btn btn-light toggle-hide" type="button" data-element="melee-singles-scoreRight"><i class="fas fa-eye"></i></i></button>' +
						'<button class="btn btn-light element-settings-button" data-element="melee-singles-scoreRight" type="button" data-toggle="modal" data-target="#element-settings"><i class="fas fa-cog"></i></button>' +
					'</div>' +
				'</div>'
			);

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
						'<button class="btn btn-primary switch" data-switch="team" type="button"><i class="fas fa-exchange-alt"></i></button>' +
						'<input class="updateable flex-wide" type="text" name="ow-teamRight" placeholder="Right Team Name">' +
						'<button class="btn btn-light toggle-hide" type="button" data-element="ow-teamRight"><i class="fas fa-eye"></i></i></button>' +
						'<button class="btn btn-light element-settings-button" data-element="ow-teamRight" type="button" data-toggle="modal" data-target="#element-settings"><i class="fas fa-cog"></i></button>' +
					'</div>' +
					'<div class="flex-container flex-center full-width ">' +
						'<button class="btn btn-light element-settings-button" data-element="ow-scoreLeft" type="button" data-toggle="modal" data-target="#element-settings"><i class="fas fa-cog"></i></button>' +
						'<button class="btn btn-light toggle-hide" type="button" data-element="ow-scoreLeft"><i class="fas fa-eye"></i></i></button>' +
						'<input class="updateable" type="number" name="ow-scoreLeft" size="2" value="0" min="0">' +
						'<button class="btn btn-primary switch" data-switch="score" type="button"><i class="fas fa-exchange-alt"></i></button>' +
						'<input class="updateable" type="number" name="ow-scoreRight" size="2" value="0" min="0">' +
						'<button class="btn btn-light toggle-hide" type="button" data-element="ow-scoreRight"><i class="fas fa-eye"></i></i></button>' +
						'<button class="btn btn-light element-settings-button" data-element="ow-scoreRight" type="button" data-toggle="modal" data-target="#element-settings"><i class="fas fa-cog"></i></button>' +
					'</div>' +
				'</div>'
			);

			break;
			
		case 'OPSE':
			//console.log("test");
			$('.overlay[data-overlayid=' + overlayID + '] .module[data-moduleid=' + module.id + '] .updateable[name=game]').after(
				'<div class="game" >' +
					'<div class="flex-container full-width ">' + //School Name
						'<button class="btn btn-light element-settings-button" data-element="opse-teamLeft" type="button" data-toggle="modal" data-target="#element-settings"><i class="fas fa-cog"></i></button>' +
						'<button class="btn btn-light toggle-hide" type="button" data-element="opse-teamLeft"><i class="fas fa-eye"></i></i></button>' +
						'<input class="updateable flex-wide" type="text" name="opse-teamLeft" placeholder="Left Team Name">' +
						'<button class="btn btn-primary switch" data-target1="opse-teamLeft" data-target2="opse-teamRight" type="button"><i class="fas fa-exchange-alt"></i></button>' +
						'<input class="updateable flex-wide" type="text" name="opse-teamRight" placeholder="Right Team Name">' +
						'<button class="btn btn-light toggle-hide" type="button" data-element="opse-teamRight"><i class="fas fa-eye"></i></i></button>' +
						'<button class="btn btn-light element-settings-button" data-element="opse-teamRight" type="button" data-toggle="modal" data-target="#element-settings"><i class="fas fa-cog"></i></button>' +
					'</div>' +
					'<div class="flex-container flex-center full-width ">' + //School Logo
						'<button class="btn btn-light element-settings-button" data-element="opse-charLeft-img" type="button" data-toggle="modal" data-target="#element-settings"><i class="fas fa-cog"></i></button>' +
						'<button class="btn btn-light toggle-hide" type="button" data-element="opse-charLeft-img"><i class="fas fa-eye"></i></i></button>' +
						'<img class="dynamic-image melee-char" data-target="opse-charLeft-img">' +
						'<input class="updateable flex-wide dynamic-image-target" list="opse_schools" data-storage-ref="opse_schools" name="opse-charLeft-img">' +
						'<button class="btn btn-primary switch" data-target1="opse-charLeft-img" data-target2="opse-charRight-img" type="button"><i class="fas fa-exchange-alt"></i></button>' +
						'<input class="updateable flex-wide dynamic-image-target" list="opse_schools" data-storage-ref="opse_schools" name="opse-charRight-img">' +
						'<img class="dynamic-image melee-char" data-target="opse-charRight-img">' +
						'<button class="btn btn-light toggle-hide" type="button" data-element="opse-charRight-img"><i class="fas fa-eye"></i></i></button>' +
						'<button class="btn btn-light element-settings-button" data-element="opse-charRight-img" type="button" data-toggle="modal" data-target="#element-settings"><i class="fas fa-cog"></i></button>' +
					'</div>' +
					'<div class="flex-container flex-center full-width ">' + //Score
						'<button class="btn btn-light element-settings-button" data-element="opse-scoreLeft" type="button" data-toggle="modal" data-target="#element-settings"><i class="fas fa-cog"></i></button>' +
						'<button class="btn btn-light toggle-hide" type="button" data-element="opse-scoreLeft"><i class="fas fa-eye"></i></i></button>' +
						'<input class="updateable" type="number" name="opse-scoreLeft" size="2" value="0" min="0">' +
						'<button class="btn btn-primary switch" data-target1="opse-scoreLeft" data-target2="opse-scoreRight" type="button"><i class="fas fa-exchange-alt"></i></button>' +
						'<input class="updateable" type="number" name="opse-scoreRight" size="2" value="0" min="0">' +
						'<button class="btn btn-light toggle-hide" type="button" data-element="opse-scoreRight"><i class="fas fa-eye"></i></i></button>' +
						'<button class="btn btn-light element-settings-button" data-element="opse-scoreRight" type="button" data-toggle="modal" data-target="#element-settings"><i class="fas fa-cog"></i></button>' +
					'</div>' +
				'</div>'
			);
			
			//listen to switch buttons
			listenSwitch(module.id);
			
			break;
			
		case 'OPSE Hearthstone':
			//console.log("test");
			$('.overlay[data-overlayid=' + overlayID + '] .module[data-moduleid=' + module.id + '] .updateable[name=game]').after(
				'<div class="game" >' +
					'<div class="flex-container full-width ">' + //School Name
						'<button class="btn btn-light element-settings-button" data-element="opse-hs-teamLeft" type="button" data-toggle="modal" data-target="#element-settings"><i class="fas fa-cog"></i></button>' +
						'<button class="btn btn-light toggle-hide" type="button" data-element="opse-hs-teamLeft"><i class="fas fa-eye"></i></i></button>' +
						'<input class="updateable flex-wide" type="text" name="opse-hs-teamLeft" placeholder="Left Team Name">' +
						'<button class="btn btn-primary switch" data-target1="opse-hs-teamLeft" data-target2="opse-hs-teamRight" type="button"><i class="fas fa-exchange-alt"></i></button>' +
						'<input class="updateable flex-wide" type="text" name="opse-hs-teamRight" placeholder="Right Team Name">' +
						'<button class="btn btn-light toggle-hide" type="button" data-element="opse-hs-teamRight"><i class="fas fa-eye"></i></i></button>' +
						'<button class="btn btn-light element-settings-button" data-element="opse-hs-teamRight" type="button" data-toggle="modal" data-target="#element-settings"><i class="fas fa-cog"></i></button>' +
					'</div>' +
					'<div class="flex-container flex-center full-width ">' + //School Logo
						'<button class="btn btn-light element-settings-button" data-element="opse-hs-charLeft-img" type="button" data-toggle="modal" data-target="#element-settings"><i class="fas fa-cog"></i></button>' +
						'<button class="btn btn-light toggle-hide" type="button" data-element="opse-hs-charLeft-img"><i class="fas fa-eye"></i></i></button>' +
						'<img class="dynamic-image melee-char" data-target="opse-hs-charLeft-img">' +
						'<input class="updateable flex-wide dynamic-image-target" list="opse_schools" data-storage-ref="opse_schools" name="opse-hs-charLeft-img">' +
						'<button class="btn btn-primary switch" data-target1="opse-hs-charLeft-img" data-target2="opse-hs-charRight-img" type="button"><i class="fas fa-exchange-alt"></i></button>' +
						'<input class="updateable flex-wide dynamic-image-target" list="opse_schools" data-storage-ref="opse_schools" name="opse-hs-charRight-img">' +
						'<img class="dynamic-image melee-char" data-target="opse-hs-charRight-img">' +
						'<button class="btn btn-light toggle-hide" type="button" data-element="opse-hs-charRight-img"><i class="fas fa-eye"></i></i></button>' +
						'<button class="btn btn-light element-settings-button" data-element="opse-hs-charRight-img" type="button" data-toggle="modal" data-target="#element-settings"><i class="fas fa-cog"></i></button>' +
					'</div>' +
					'<div class="flex-container flex-center full-width ">' + //Class Logo
						'<button class="btn btn-light element-settings-button" data-element="opse-hs-classLeft-img" type="button" data-toggle="modal" data-target="#element-settings"><i class="fas fa-cog"></i></button>' +
						'<button class="btn btn-light toggle-hide" type="button" data-element="opse-hs-classLeft-img"><i class="fas fa-eye"></i></i></button>' +
						'<img class="dynamic-image melee-char" data-target="opse-hs-classLeft-img">' +
						'<input class="updateable flex-wide dynamic-image-target" list="hearthstone_classes" data-storage-ref="hearthstone_classes" name="opse-hs-classLeft-img">' +
						'<button class="btn btn-primary switch" data-target1="opse-hs-classLeft-img" data-target2="opse-hs-classRight-img" type="button"><i class="fas fa-exchange-alt"></i></button>' +
						'<input class="updateable flex-wide dynamic-image-target" list="hearthstone_classes" data-storage-ref="hearthstone_classes" name="opse-hs-classRight-img">' +
						'<img class="dynamic-image melee-class" data-target="opse-hs-classRight-img">' +
						'<button class="btn btn-light toggle-hide" type="button" data-element="opse-hs-classRight-img"><i class="fas fa-eye"></i></i></button>' +
						'<button class="btn btn-light element-settings-button" data-element="opse-hs-classRight-img" type="button" data-toggle="modal" data-target="#element-settings"><i class="fas fa-cog"></i></button>' +
					'</div>' +
					'<div class="flex-container flex-center full-width ">' + //Score
						'<button class="btn btn-light element-settings-button" data-element="opse-hs-scoreLeft" type="button" data-toggle="modal" data-target="#element-settings"><i class="fas fa-cog"></i></button>' +
						'<button class="btn btn-light toggle-hide" type="button" data-element="opse-hs-scoreLeft"><i class="fas fa-eye"></i></i></button>' +
						'<input class="updateable" type="number" name="opse-hs-scoreLeft" size="2" value="0" min="0">' +
						'<button class="btn btn-primary switch" data-target1="opse-hs-scoreLeft" data-target2="opse-hs-scoreRight" type="button"><i class="fas fa-exchange-alt"></i></button>' +
						'<input class="updateable" type="number" name="opse-hs-scoreRight" size="2" value="0" min="0">' +
						'<button class="btn btn-light toggle-hide" type="button" data-element="opse-hs-scoreRight"><i class="fas fa-eye"></i></i></button>' +
						'<button class="btn btn-light element-settings-button" data-element="opse-hs-scoreRight" type="button" data-toggle="modal" data-target="#element-settings"><i class="fas fa-cog"></i></button>' +
					'</div>' +
				'</div>'
			);
			
			//listen to switch buttons
			listenSwitch(module.id);
			
			break;
			
		case 'OPSE Rocket League':
			//console.log("test");
			$('.overlay[data-overlayid=' + overlayID + '] .module[data-moduleid=' + module.id + '] .updateable[name=game]').after(
				'<div class="game" >' +
					'<div class="flex-container full-width ">' + //School Name
						'<button class="btn btn-light element-settings-button" data-element="opse-hs-teamLeft" type="button" data-toggle="modal" data-target="#element-settings"><i class="fas fa-cog"></i></button>' +
						'<button class="btn btn-light toggle-hide" type="button" data-element="opse-hs-teamLeft"><i class="fas fa-eye"></i></i></button>' +
						'<input class="updateable flex-wide" type="text" name="opse-hs-teamLeft" placeholder="Left Team Name">' +
						'<button class="btn btn-primary switch" data-target1="opse-hs-teamLeft" data-target2="opse-hs-teamRight" type="button"><i class="fas fa-exchange-alt"></i></button>' +
						'<input class="updateable flex-wide" type="text" name="opse-hs-teamRight" placeholder="Right Team Name">' +
						'<button class="btn btn-light toggle-hide" type="button" data-element="opse-hs-teamRight"><i class="fas fa-eye"></i></i></button>' +
						'<button class="btn btn-light element-settings-button" data-element="opse-hs-teamRight" type="button" data-toggle="modal" data-target="#element-settings"><i class="fas fa-cog"></i></button>' +
					'</div>' +
					'<div class="flex-container flex-center full-width ">' + //School Logo
						'<button class="btn btn-light element-settings-button" data-element="opse-hs-charLeft-img" type="button" data-toggle="modal" data-target="#element-settings"><i class="fas fa-cog"></i></button>' +
						'<button class="btn btn-light toggle-hide" type="button" data-element="opse-hs-charLeft-img"><i class="fas fa-eye"></i></i></button>' +
						'<img class="dynamic-image melee-char" data-target="opse-hs-charLeft-img">' +
						'<input class="updateable flex-wide dynamic-image-target" list="opse_schools" data-storage-ref="opse_schools" name="opse-hs-charLeft-img">' +
						'<button class="btn btn-primary switch" data-target1="opse-hs-charLeft-img" data-target2="opse-hs-charRight-img" type="button"><i class="fas fa-exchange-alt"></i></button>' +
						'<input class="updateable flex-wide dynamic-image-target" list="opse_schools" data-storage-ref="opse_schools" name="opse-hs-charRight-img">' +
						'<img class="dynamic-image melee-char" data-target="opse-hs-charRight-img">' +
						'<button class="btn btn-light toggle-hide" type="button" data-element="opse-hs-charRight-img"><i class="fas fa-eye"></i></i></button>' +
						'<button class="btn btn-light element-settings-button" data-element="opse-hs-charRight-img" type="button" data-toggle="modal" data-target="#element-settings"><i class="fas fa-cog"></i></button>' +
					'</div>' +
					'<div class="flex-container flex-center full-width ">' + //Class Logo
						'<button class="btn btn-light element-settings-button" data-element="opse-hs-classLeft-img" type="button" data-toggle="modal" data-target="#element-settings"><i class="fas fa-cog"></i></button>' +
						'<button class="btn btn-light toggle-hide" type="button" data-element="opse-hs-classLeft-img"><i class="fas fa-eye"></i></i></button>' +
						'<img class="dynamic-image melee-char" data-target="opse-hs-classLeft-img">' +
						'<input class="updateable flex-wide dynamic-image-target" list="hearthstone_classes" data-storage-ref="hearthstone_classes" name="opse-hs-classLeft-img">' +
						'<button class="btn btn-primary switch" data-target1="opse-hs-classLeft-img" data-target2="opse-hs-classRight-img" type="button"><i class="fas fa-exchange-alt"></i></button>' +
						'<input class="updateable flex-wide dynamic-image-target" list="hearthstone_classes" data-storage-ref="hearthstone_classes" name="opse-hs-classRight-img">' +
						'<img class="dynamic-image melee-class" data-target="opse-hs-classRight-img">' +
						'<button class="btn btn-light toggle-hide" type="button" data-element="opse-hs-classRight-img"><i class="fas fa-eye"></i></i></button>' +
						'<button class="btn btn-light element-settings-button" data-element="opse-hs-classRight-img" type="button" data-toggle="modal" data-target="#element-settings"><i class="fas fa-cog"></i></button>' +
					'</div>' +
					'<div class="flex-container flex-center full-width ">' + //Score
						'<button class="btn btn-light element-settings-button" data-element="opse-hs-scoreLeft" type="button" data-toggle="modal" data-target="#element-settings"><i class="fas fa-cog"></i></button>' +
						'<button class="btn btn-light toggle-hide" type="button" data-element="opse-hs-scoreLeft"><i class="fas fa-eye"></i></i></button>' +
						'<input class="updateable" type="number" name="opse-hs-scoreLeft" size="2" value="0" min="0">' +
						'<button class="btn btn-primary switch" data-target1="opse-hs-scoreLeft" data-target2="opse-hs-scoreRight" type="button"><i class="fas fa-exchange-alt"></i></button>' +
						'<input class="updateable" type="number" name="opse-hs-scoreRight" size="2" value="0" min="0">' +
						'<button class="btn btn-light toggle-hide" type="button" data-element="opse-hs-scoreRight"><i class="fas fa-eye"></i></i></button>' +
						'<button class="btn btn-light element-settings-button" data-element="opse-hs-scoreRight" type="button" data-toggle="modal" data-target="#element-settings"><i class="fas fa-cog"></i></button>' +
					'</div>' +
				'</div>'
			);
			
			//listen to switch buttons
			listenSwitch(module.id);
			
			break;
		
		case "EA NHL":
			
			$('.overlay[data-overlayid=' + overlayID + '] .module[data-moduleid=' + module.id + '] .updateable[name=game]').after(
				'<div class="game" >' +
					'<div class="flex-container full-width ">' +
						'<button class="btn btn-light element-settings-button" data-element="nhl-playerLeft" type="button" data-toggle="modal" data-target="#element-settings"><i class="fas fa-cog"></i></button>' +
						'<button class="btn btn-light toggle-hide" type="button" data-element="nhl-playerLeft"><i class="fas fa-eye"></i></i></button>' +
						'<input class="updateable flex-wide" type="text" name="nhl-playerLeft" placeholder="Left Player Name">' +
						'<button class="btn btn-primary switch" data-target1="nhl-playerLeft" data-target2="nhl-playerRight" type="button"><i class="fas fa-exchange-alt"></i></button>' +
						'<input class="updateable flex-wide" type="text" name="nhl-playerRight" placeholder="Right Player Name">' +
						'<button class="btn btn-light toggle-hide" type="button" data-element="nhl-playerRight"><i class="fas fa-eye"></i></i></button>' +
						'<button class="btn btn-light element-settings-button" data-element="nhl-playerRight" type="button" data-toggle="modal" data-target="#element-settings"><i class="fas fa-cog"></i></button>' +
					'</div>' +
					'<div class="flex-container flex-center full-width ">' +
						'<button class="btn btn-light element-settings-button" data-element="nhl-scoreLeft" type="button" data-toggle="modal" data-target="#element-settings"><i class="fas fa-cog"></i></button>' +
						'<button class="btn btn-light toggle-hide" type="button" data-element="nhl-scoreLeft"><i class="fas fa-eye"></i></i></button>' +
						'<input class="updateable" type="number" name="nhl-scoreLeft" size="2" value="0" min="0">' +
						'<button class="btn btn-primary switch" data-target1="nhl-scoreLeft" data-target2="nhl-scoreRight" type="button"><i class="fas fa-exchange-alt"></i></button>' +
						'<input class="updateable" type="number" name="nhl-scoreRight" size="2" value="0" min="0">' +
						'<button class="btn btn-light toggle-hide" type="button" data-element="nhl-scoreRight"><i class="fas fa-eye"></i></i></button>' +
						'<button class="btn btn-light element-settings-button" data-element="nhl-scoreRight" type="button" data-toggle="modal" data-target="#element-settings"><i class="fas fa-cog"></i></button>' +
					'</div>' +
				'</div>'
			);
			
			break;
	}
	
	//listen to element settings buttons
	listenElementSettings(module.id);
	
	//display appropriate inputs on inputs with dynamic images
	$('.module[data-moduleid=' + module.id + '] .dynamic-image-target').change(function(){
		var imageRef = $(this).val();
		var storageRef = $(this).attr('data-storage-ref');
		var target = $(this).attr('name');
		
		displayImages(module.id,target,storageRef,imageRef);
	});
	
	
}

//Function for displaying appropriate inputs on list value (game category) change
function displayImageType(overlayID, module, imageType){

	switch(imageType){
		case "lol_positions": //League of legends positions
			$('.overlay[data-overlayid=' + overlayID + '] .module[data-moduleid=' + module.id + '] .updateable[name=imageType]').after(
				'<div class="imageType" >' +
					'<div class="flex-container flex-center full-width ">' + //League position
						'<button class="btn btn-light element-settings-button" data-element="img" type="button" data-toggle="modal" data-target="#element-settings"><i class="fas fa-cog"></i></button>' +
						'<button class="btn btn-light toggle-hide" type="button" data-element="img"><i class="fas fa-eye"></i></i></button>' +
						'<input class="updateable flex-wide dynamic-image-target" list="lol_positions" data-storage-ref="lol_positions" name="img">' +
						'<img class="dynamic-image melee-char" data-target="img">' +
					'</div>' +
				'</div>'
			);
			
			break;
			
	}
	
	//listen to element settings buttons
	listenElementSettings(module.id);
	
	//display appropriate inputs on inputs with dynamic images
	$('.module[data-moduleid=' + module.id + '] .dynamic-image-target').change(function(){
		var imageRef = $(this).val();
		var storageRef = $(this).attr('data-storage-ref');
		var target = $(this).attr('name');
		
		displayImages(module.id,target,storageRef,imageRef);
	});
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
}

function displayOverlay(data){
	$('.overlays').append(
		'<div class="overlay" data-overlayid="' + data.id + '" data-overlayname="' + data.data().name + '">' +
			'<input class="overlay-id" type="hidden" value="' + data.id + '">' +
			'<div class="flex-container full-width">' +
				'<h3 class="overlay-name">' + data.data().name + '</h3>' +
			'</div>' +
			'<p><b>Overlay Link:</b> <a class="link" target="_blank" href="https://control.streamland.ca/' + uid + '/' + data.id + '">' + 'control.streamland.ca/' + uid + '/' + data.id + '</a> <button type="button" class="btn btn-light copy-clip"><i class="fas fa-clipboard"></i></button></p>' +
			'<div class="modules"></div>' +
			'<button class="btn btn-primary add-module" type="button" data-toggle="modal" data-target="#add-module"><i class="fas fa-plus-circle"></i> Add Module</button>' +
			'<button class="btn btn-danger remove-overlay" type="button"><i class="fas fa-trash-alt"></i> Remove Overlay</button>' +
			'<br class="clear">' +
		'</div>');
	
	
	//Listen to copy-to-clipboard button
	listenCopyClip(data.id);
	
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