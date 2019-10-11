/*--------------
//Overlay
--------------*/

/*Retrieve user ID*/
var uid = $('meta[name="uid"]').attr('data');
var overlayid = $('meta[name="uid"]').attr('data');

/*--------------
//Module Functions
--------------*/

/*--------------
//Event Listeners
--------------*/
$("overlay-program").ready(function(){//Initialize Event Listeners
	
	/*--------------
	//Realtime Event Listener
	--------------*/
	firebase.firestore().collection('users').doc(uid).collection("overlays").doc(overlayid).collection("modules").onSnapshot(snapshot => {
		let changes = snapshot.docChanges();
		//console.log(changes);
		changes.forEach(change =>{
			console.log(change.doc.data());
			/*if(change.type == 'added'){
				console.log(change.doc.data().status);
			} else if (change.type == 'modified'){
				console.log(change.doc);
			}*.
		});
	});
});