/*--------------
//Overlay
--------------*/

/*Retrieve user ID*/
var uid = $('meta[name="uid"]').attr('data');
var overlayid = $('meta[name="uid"]').attr('data');

/*--------------
//Event Listeners
--------------*/
$("overlay-program").ready(function(){//Initialize Event Listeners
	
	/*--------------
	//Realtime Event Listener
	--------------*/
	firebase.firestore().collection('users').doc(uid).collection("overlays").doc(overlayid).collection("modules").doc('versus').collection('elements').onSnapshot(function(querySnapshot) {
		querySnapshot.forEach(function(doc){
			$('body').append(
				'<h1>Helldddo World</h1>'
			);
		});
	});
});