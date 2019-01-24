/*--------------
//Modules
--------------*/
var uid = $('meta[name="uid"]').attr('data');
//var overlayid = ;





$(document).ready(function(){//Initialize Event Listeners
	
	
	
	/*--------------
	//Realtime Event Listener
	--------------*/
	firebase.firestore().collection('users').doc(uid).collection("overlays").onSnapshot(function(querySnapshot) {
		$('.overlay').remove();
		querySnapshot.forEach(function(doc){
			displayModule(doc.data());
		});
	});
});