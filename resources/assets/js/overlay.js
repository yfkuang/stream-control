/*--------------
//Overlay
--------------*/

/*Retrieve user ID*/
var uid = $('meta[name="uid"]').attr('data');
var overlayid = $('meta[name="overlayid"]').attr('data');

//Animations JSON
var fadeIn = {
	"opacity": 1,
};

var fadeInFromLeft = {
	"opacity": 1,
	"transform": "translateX(10px)",
};

var fadeInFromRight = {
	"opacity": 1,
	"transform": "translateX(-10px)",
};

var fadeOut = {
	"opacity": 0,
};

var fadeOutToLeft = {
	"opacity": 0,
	"transform": "translateX(-10px)",
};

var fadeOutToRight = {
	"opacity": 0,
	"transform": "translateX(10px)",
};

/*--------------
//Module Functions
--------------*/
function displayModule(doc){
	if (doc.exists){
		//console.log(doc.data());
		switch(doc.data().type){
			//Versus
			case 'versus':
				doc.ref.collection("elements").doc("game").get().then(function(game){
					if(game.exists){
						
						switch(game.data().value){
							case 'Overwatch':
								$("body").append(
									'<div class="module" data-moduleid="' + doc.id + '">' +
										'<p class="element" style="" data-element="ow-teamLeft"></p>' +
										'<p class="element" style="" data-element="ow-teamRight"></p>' +
										'<p class="element" style="" data-element="ow-scoreLeft"></p>' +
										'<p class="element" style="" data-element="ow-scoreRight"></p>' +
									'</div>'
								);
								
								break;
						}
						
						/*--------------
						//Realtime Event Listener
						--------------*/
						/*firebase.firestore().collection('users').doc(uid).collection("overlays").doc(overlayid).collection("modules").doc(doc.id).collection("elements").onSnapshot(snapshot => {
							let changes = snapshot.docChanges();
							//console.log(changes);
							changes.forEach(change =>{
								//console.log(change.doc.data().value);
								$(".module[data-moduleid=" + doc.id + "] .element[data-element=" + change.doc.id + "]").text(change.doc.data().value);
								$(".module[data-moduleid=" + doc.id + "] .element[data-element=" + change.doc.id + "]").attr("style", change.doc.data().css);
								$(".module[data-moduleid=" + doc.id + "] .element[data-element=" + change.doc.id + "]").animate({
									opacity: 1,	
								},250);
							});
						});*/
					}		
				});
				
				break;
				
			//Lower-thirds
			case 'lower-thirds':
				$("body").append(
					'<div class="module" data-moduleid="' + doc.id + '">' +
						'<p class="element" style="" data-element="upperl3d"></p>' +
						'<p class="element" style="" data-element="lowerl3d"></p>' +
					'</div>'
				);
				
				break;
		}
		
		/*--------------
		//Realtime Event Listener
		--------------*/
		firebase.firestore().collection('users').doc(uid).collection("overlays").doc(overlayid).collection("modules").doc(doc.id).collection("elements").onSnapshot(snapshot => {
			let changes = snapshot.docChanges();
			//console.log(changes);
			changes.forEach(change =>{
				//console.log(change.doc.data().value);
				$(".module[data-moduleid=" + doc.id + "] .element[data-element=" + change.doc.id + "]").animate(fadeOut,250);
				$(".module[data-moduleid=" + doc.id + "] .element[data-element=" + change.doc.id + "]").text(change.doc.data().value);
				$(".module[data-moduleid=" + doc.id + "] .element[data-element=" + change.doc.id + "]").attr("style", change.doc.data().css);
				$(".module[data-moduleid=" + doc.id + "] .element[data-element=" + change.doc.id + "]").animate(fadeIn,250);
			});
		});
	}
}

/*--------------
//Event Listeners
--------------*/
$("overlay-program").ready(function(){//Initialize Event Listeners
	var pathname = window.location.pathname;
	if(pathname != "/" && pathname != "/dashboard"){
		/*--------------
		//Realtime Event Listener
		--------------*/
		firebase.firestore().collection('users').doc(uid).collection("overlays").doc(overlayid).collection("modules").onSnapshot(snapshot => {
			let changes = snapshot.docChanges();
			//console.log(changes);
			changes.forEach(change =>{
				//console.log(change.doc);
				if(change.type == 'added'){
					displayModule(change.doc);
				} else if (change.type == 'modified'){
					//displayModule(change.doc);
				}
			});
		});
	}
});