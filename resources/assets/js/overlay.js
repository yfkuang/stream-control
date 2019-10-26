/*--------------
//Overlay
--------------*/

/*Retrieve user ID*/
var uid = $('meta[name="uid"]').attr('data');
var overlayid = $('meta[name="overlayid"]').attr('data');

//Animations JSON
var animationArray = {
	"none": {
		"opacity": 1
	},
	"fadeIn": {
		"opacity": 1,
	},
	"fadeInFromLeft": {
		"opacity": 1,
		"transform": "translateX(10px)",
	},
	"fadeInFromRight": {
		"opacity": 1,
		"transform": "translateX(-10px)",
	},
	"fadeOut": {
		"opacity": 0,
	},
	"fadeOutToLeft": {
		"opacity": 0,
		"transform": "translateX(-10px)",
	},
	"fadeOutToRight": {
		"opacity": 0,
		"transform": "translateX(10px)",
	}
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
						
						//Data event Listener
						dataChange(doc);
					}		
				});
				
				break;
			
			//Lower-thirds
			case 'text':
				$("body").append(
					'<div class="module" data-moduleid="' + doc.id + '">' +
						'<p class="element" style="" data-element="text"></p>' +
					'</div>'
				);
				
				dataChange(doc);
				
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
		
		//Data event Listener
		//dataChange(doc);
	}
}

/*--------------
//Event Listeners
--------------*/
function dataChange(doc){
	firebase.firestore().collection('users').doc(uid).collection("overlays").doc(overlayid).collection("modules").doc(doc.id).collection("elements").onSnapshot(snapshot => {
		let changes = snapshot.docChanges();
		//console.log(changes);
		changes.forEach(change =>{
			var style = {
				"height": change.doc.data().height,
				"width": change.doc.data().width,
				"font-size": change.doc.data().fontSize,
				"font-family": change.doc.data().font,
				"font-weight": change.doc.data().fontWeight,
				"letter-spacing": change.doc.data().letterSpace,
			}
			
			switch (change.doc.data().anchor){
				case 'topLeft':
					var position = {
						"top": change.doc.data().y,
						"left": change.doc.data().x,
					};
					
					break;
					
				case 'topRight':
					var position = {
						"top": change.doc.data().y,
						"right": change.doc.data().x,
					};
					
					break;
					
				case 'botLeft':
					var position = {
						"bottom": change.doc.data().y,
						"left": change.doc.data().x,
					};
					
					break;
					
				case 'botRight':
					var position = {
						"bottom": change.doc.data().y,
						"right": change.doc.data().x,
					};
					
					break;
			}
			
			if(position){
				$.extend(style,position);
			}
			
			if(change.doc.data().css){
				var addCSS = change.doc.data().css.replace('\n','').split(';');
				var arrayCSS = {};
				
				addCSS.forEach(function(property){
					var propertyArray = property.split(':');
					arrayCSS[propertyArray[0]] = propertyArray[1];
				});
				
				$.extend(style,arrayCSS);
			}
			
			//console.log(animationArray[change.doc.data().animationIn]);
			
			$(".module[data-moduleid=" + doc.id + "] .element[data-element=" + change.doc.id + "]").delay(change.doc.data().delayOut).animate(animationArray[change.doc.data().animationOut], change.doc.data().durationOut);
			$(".module[data-moduleid=" + doc.id + "] .element[data-element=" + change.doc.id + "]").text(change.doc.data().value);
			$(".module[data-moduleid=" + doc.id + "] .element[data-element=" + change.doc.id + "]").css(style);
			
			if(!$('link[href="https://fonts.googleapis.com/css?family=' + change.doc.data().font + '"]').length && change.doc.data().font !== undefined) {
				$("head").append(
					'<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=' + change.doc.data().font +'">'
				);
			} else {
				console.log("font already linked");
			}
			
			$(".module[data-moduleid=" + doc.id + "] .element[data-element=" + change.doc.id + "]").delay(change.doc.data().delayIn).animate(animationArray[change.doc.data().animationIn], change.doc.data().durationIn);
		});
	});
}

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
					displayModule(change.doc);
				}
			});
		});
	}
});