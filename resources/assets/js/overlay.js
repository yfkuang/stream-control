/*--------------
//Overlay
--------------*/

/*Retrieve user ID*/
var uid = $('meta[name="uid"]').attr('data');
var overlayid = $('meta[name="overlayid"]').attr('data');

/*--------------
//General Functions
--------------*/

//Function to replace text nodes and only text nodes of a selector
jQuery.fn.textNodes = function() {
  return this.contents().filter(function() {
    return (this.nodeType === Node.TEXT_NODE && this.nodeValue.trim() !== "");
  });
}

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
							case 'Generic':
								$("body").append(
									'<div class="module" data-moduleid="' + doc.id + '">' +
										'<p class="element" style="" data-element="gnrc-playerLeft"></p>' +
										'<p class="element" style="" data-element="gnrc-playerRight"></p>' +
										'<p class="element" style="" data-element="gnrc-scoreLeft"></p>' +
										'<p class="element" style="" data-element="gnrc-scoreRight"></p>' +
									'</div>'
								);
								
								break;
								
							case 'Super Smash Bros. Melee Singles':
								$("body").append(
									'<div class="module" data-moduleid="' + doc.id + '">' +
										'<p class="element" style="" data-element="melee-singles-playerLeft"><span class="element" style="" data-element="melee-singles-sponsorLeft"></span></p>' +
										'<p class="element" style="" data-element="melee-singles-playerRight"><span class="element" style="" data-element="melee-singles-sponsorRight"></span></p>' +
										'<img class="element dynamic-image" data-list="melee-char" data-element="melee-singles-charLeft-img">' +
										'<img class="element dynamic-image" data-list="melee-char" data-element="melee-singles-charRight-img">' +
										'<p class="element" style="" data-element="melee-singles-portLeft"></p>' +
										'<p class="element" style="" data-element="melee-singles-portRight"></p>' +
										'<p class="element" style="" data-element="melee-singles-scoreLeft"></p>' +
										'<p class="element" style="" data-element="melee-singles-scoreRight"></p>' +
									'</div>'
								);
								
								break;
							
							case 'Overwatch':
								$("body").append(
									'<div class="module" data-moduleid="' + doc.id + '">' +
										'<p class="element" style="" data-element="ow-teamLeft"></p>' +
										'<p class="element" style="" data-element="ow-teamRight"></p>' +
										'<p class="element" style="" data-element="ow-scoreLeft"></p>' +
										'<p class="element" style="" data-element="ow-scoreRight"></p>' +
									'</div>'
								);
							
							case 'OPSE':
								$("body").append(
									'<div class="module" data-moduleid="' + doc.id + '">' +
										'<p class="element" style="" data-element="opse-teamLeft"></p>' +
										'<p class="element" style="" data-element="opse-teamRight"></p>' +
										'<img class="element dynamic-image" data-list="opse_schools" data-element="opse-charLeft-img">' +
										'<img class="element dynamic-image" data-list="opse_schools" data-element="opse-charRight-img">' +
										'<p class="element" style="" data-element="opse-scoreLeft"></p>' +
										'<p class="element" style="" data-element="opse-scoreRight"></p>' +
									'</div>'
								);
								
							case 'OPSE Hearthstone':
								$("body").append(
									'<div class="module" data-moduleid="' + doc.id + '">' +
										'<p class="element" style="" data-element="opse-hs-teamLeft"></p>' +
										'<p class="element" style="" data-element="opse-hs-teamRight"></p>' +
										'<img class="element dynamic-image" data-list="opse_schools" data-element="opse-hs-charLeft-img">' +
										'<img class="element dynamic-image" data-list="opse_schools" data-element="opse-hs-charRight-img">' +
										'<img class="element dynamic-image" data-list="hearthstone_classes" data-element="opse-hs-classLeft-img">' +
										'<img class="element dynamic-image" data-list="hearthstone_classes" data-element="opse-hs-classRight-img">' +
										'<p class="element" style="" data-element="opse-hs-scoreLeft"></p>' +
										'<p class="element" style="" data-element="opse-hs-scoreRight"></p>' +
									'</div>'
								);
								
								break;
								
							case 'EA NHL':
								$("body").append(
									'<div class="module" data-moduleid="' + doc.id + '">' +
										'<p class="element" style="" data-element="nhl-teamLeft"></p>' +
										'<p class="element" style="" data-element="nhl-teamRight"></p>' +
										'<p class="element" style="" data-element="nhl-scoreLeft"></p>' +
										'<p class="element" style="" data-element="nhl-scoreRight"></p>' +
									'</div>'
								);
								
								break;
						}
						
						//Data event Listener
						dataChange(doc);
					}		
				});
				
				break;
			
			//Text
			case 'text':
				$("body").append(
					'<div class="module" data-moduleid="' + doc.id + '">' +
						'<p class="element" style="" data-element="text"></p>' +
					'</div>'
				);
				
				dataChange(doc);
				
				break;
				
			//Casters
			case 'casters':
				$("body").append(
					'<div class="module" data-moduleid="' + doc.id + '">' +
						'<p class="element" style="" data-element="casterTag1"></p>' +
						'<p class="element" style="" data-element="casterTwitter1"></p>' +
						'<p class="element" style="" data-element="casterTag2"></p>' +
						'<p class="element" style="" data-element="casterTwitter2"></p>' +
						'<p class="element" style="" data-element="casterTag2"></p>' +
						'<p class="element" style="" data-element="casterTwitter2"></p>' +
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
				
				dataChange(doc);
				
				break;
				
			case 'timer':
				$("body").append(
					'<div class="module" data-moduleid="' + doc.id + '">' +
						'<p class="element" style="" data-element="timer" id="time"></p>' +
					'</div>'
				);
				
				dataChange(doc);
				
				break;
				
			case 'head-to-head':
				$("body").append(
					'<div class="module" data-moduleid="' + doc.id + '">' +
						'<img class="element dynamic-image" data-list="opse_schools" data-element="charLeft-img">' +
						'<img class="element dynamic-image" data-list="opse_schools" data-element="charRight-img">' +
					'</div>'
				);
				
				for(i = 0; i < doc.data().nameCount; i++){
					$(".module[data-moduleid=" + doc.id + "]").append(
						'<p class="element" style="" data-element="h2h-playerLeft-' + i + '"></p>' +
						'<p class="element" style="" data-element="h2h-playerRight-' + i + '"></p>'
					);
				}
				
				dataChange(doc);

				break;
				
			case 'hearthstone-ban-and-pick':
				$("body").append(
					'<div class="module" data-moduleid="' + doc.id + '">' +
						'<img class="element dynamic-image" data-list="hearthstone_classes" data-element="pickLeft-img-1">' +
						'<img class="element dynamic-image" data-list="hearthstone_classes" data-element="pickRight-img-1">' +
						'<img class="element dynamic-image" data-list="hearthstone_classes" data-element="pickLeft-img-2">' +
						'<img class="element dynamic-image" data-list="hearthstone_classes" data-element="pickRight-img-2">' +
						'<img class="element dynamic-image" data-list="hearthstone_classes" data-element="pickLeft-img-3">' +
						'<img class="element dynamic-image" data-list="hearthstone_classes" data-element="pickRight-img-3">' +
						'<img class="element dynamic-image" data-list="hearthstone_classes" data-element="banLeft-img">' +
						'<img class="element dynamic-image" data-list="hearthstone_classes" data-element="banRight-img">' +
					'</div>'
				);
				
				dataChange(doc);

				break;
				
			case 'image':
				doc.ref.collection("elements").doc("imageType").get().then(function(imageType){
					if(imageType.exists){
						$("body").append(
							'<div class="module" data-moduleid="' + doc.id + '">' +
								'<img class="element dynamic-image" data-list="' + imageType.data().value + '" data-element="img">' +
							'</div>'
						);
						
						dataChange(doc);
					}
				});

				break;
		}
		
		//Data event Listener
		//dataChange(doc);
	}
}

function playVideo(module, element, freezeFrame, delay, duration) {
	var myVideo = $(document).find(".module[data-moduleid=" + module + "] video.element[data-element=" + element + "]");
	var videoLength = myVideo.length;

	//console.log(videoLength);
	for (var i = 0; i < videoLength; i++){
		myVideo.get(i).load();
		myVideo.get(i).pause();
	}

	setTimeout(function(){
		for (var j = 0; j < videoLength; j++){
			myVideo.get(j).play();
		}

		setTimeout(function(){
			for (var k = 0; k < videoLength; k++){
				myVideo.get(k).pause();
			}

			setTimeout(function(){
				//if(myVideo.paused){
					for (var h = 0; h < videoLength; h++){
						myVideo.get(h).play();
					}
				//}
			}, duration);
		}, freezeFrame);
	}, delay);
}

function startTimer(duration, display, startingText) {
	var timer = duration, minutes, seconds;
	
	for (var i = 0; i < 99; i++){
		window.clearInterval(i);
	}
	
	var interval = window.setInterval(function () {
		minutes = parseInt(timer / 60, 10);
		seconds = parseInt(timer % 60, 10);

		minutes = minutes < 10 ?  minutes : minutes;
		seconds = seconds < 10 ? "0" + seconds : seconds;

		display.text(minutes + ":" + seconds);
		
		if (--timer < 0) {
			//timer = duration;
			display.text(startingText);
			$('.element[data-element=waitingText]').hide();
			clearInterval(interval);
		}
	}, 1000);
}

/*--------------
//Event Listeners
--------------*/
function dataChange(doc){
	firebase.firestore().collection('users').doc(uid).collection("overlays").doc(overlayid).collection("modules").doc(doc.id).collection("elements").onSnapshot(snapshot => {
		let changes = snapshot.docChanges();
		//console.log(changes);
		
		changes.forEach(change =>{
			
			/*--------------
			//Style Changes
			--------------*/
			var style = {
				"height": change.doc.data().height,
				"width": change.doc.data().width,
				"font-size": change.doc.data().fontSize,
				"font-family": change.doc.data().font,
				"font-weight": change.doc.data().fontWeight,
				"letter-spacing": change.doc.data().letterSpace,
				"color": change.doc.data().color,
				"text-transform": change.doc.data().textTransform,
				"text-align": change.doc.data().textAlign,
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
			
			if(change.doc.data().css){//Additional CSS
				styleElement = document.createElement('style');
				if($('style[data-element=' + change.doc.id + ']')){
				   $('style[data-element=' + change.doc.id + ']').remove();
				}
				
				styleElement.textContent = '.module[data-moduleid=' + doc.id + '] .element[data-element=' + change.doc.id + ']{' + change.doc.data().css + '}';
				styleElement.setAttribute('data-element', change.doc.id);
				$('body').append(styleElement);
			}
			
			/*--------------
			//Specific Value Cases
			--------------*/
			var value;
			
			switch(change.doc.id){
				case 'melee-singles-sponsorLeft':
				case 'melee-singles-sponsorRight':
				case 'melee-doubles-teamLeft-sponsor1':
				case 'melee-doubles-teamLeft-sponsor2':
				case 'melee-doubles-teamRight-sponsor1':
				case 'melee-doubles-teamRight-sponsor2':
					value = change.doc.data().value + ' | ';
					break;
				case 'timer':
					value = change.doc.data().value + ':00';
					display = $('#time');
					firebase.firestore().collection('users').doc(uid).collection("overlays").doc(overlayid).collection("modules").doc(doc.id).collection("elements").doc("startingText").get().then(function (doc) {
						if (doc.exists) {
							startTimer(change.doc.data().value * 60, $('#time'), doc.data().value);
						} else {
							console.log("Starting text not set!");
						}
					}).catch(function(error) {
						console.log("Error getting timer starting text:", error);
					});
					break;
				case 'pick-win-1':
				case 'pick-win-2':
				case 'pick-win-3':
					switch (change.doc.data().value){
						case 'left':
							$('.element[data-element=pickLeft-img-1]').style.filter = "dropshadow(0px 0px 15px rgba(146, 255, 110, 0.5))";
							break;
						case 'right':
							$('.element[data-element=pickRight-img-1]').style.filter = "dropshadow(0px 0px 15px rgba(146, 255, 110, 0.5))";
							break;
					}
					break;
				default:
					value = change.doc.data().value;
					break;
			}
			
			/*--------------
			//Apply Changes
			--------------*/
			$(".module[data-moduleid=" + doc.id + "] .element[data-element=" + change.doc.id + "]").delay(change.doc.data().delayOut).animate(animationArray[change.doc.data().animationOut], change.doc.data().durationOut);
			$(".module[data-moduleid=" + doc.id + "] .element[data-element=" + change.doc.id + "]").removeAttr("style");
			
			//Background Webm
			if(change.doc.data().userUpload){
				$(".module[data-moduleid=" + doc.id + "] .element[data-element=" + change.doc.id + "]").wrap('<div class="element" data-element="' + change.doc.id + '"></div>');
				//Retrieve webm from storage
				firebase.storage().ref(change.doc.data().userUpload).getDownloadURL().then(function(url) {
					$(".module[data-moduleid=" + doc.id + "] div.element[data-element=" + change.doc.id + "]").prepend(
						'<video class="video" muted="muted">' +
							'<source src="' + url + '">' + //height="' + change.doc.data() + '" width="' + + '"
						'</video>'
					);	
				}).catch(function(error) {
					console.log("Error retrieving from storage: " + error);
				});		
			}
			
			//Make changes to text nodes without changing children
			if($(".module[data-moduleid=" + doc.id + "] p.element[data-element=" + change.doc.id + "]").children().length > 0){
				var children = $(".module[data-moduleid=" + doc.id + "] .element[data-element=" + change.doc.id + "]").children();
				$(".module[data-moduleid=" + doc.id + "] p.element[data-element=" + change.doc.id + "]").text(value);
				$(".module[data-moduleid=" + doc.id + "] .element[data-element=" + change.doc.id + "]").prepend(children);
			} else if (change.doc.id.includes("img")) {
				var storageRef = $(".module[data-moduleid=" + doc.id + "] .element[data-element=" + change.doc.id + "]").attr("data-list");
				
				//Retrieve image from storage
				firebase.storage().ref(storageRef + '/' + value + '.png').getDownloadURL().then(function(url) {
					$(".module[data-moduleid=" + doc.id + "] .element[data-element=" + change.doc.id + "]").attr('src',url);
				}).catch(function(error) {
					console.log("Error retrieving from storage: " + error);
				});
			} else {
				$(".module[data-moduleid=" + doc.id + "] p.element[data-element=" + change.doc.id + "]").text(value);
			}
			
			//Apply CSS
			$(".module[data-moduleid=" + doc.id + "] .element[data-element=" + change.doc.id + "]").css(style);
			
			if(!$('link[href="https://fonts.googleapis.com/css?family=' + change.doc.data().font + '"]').length && change.doc.data().font !== undefined) {
				try{
					$("head").append(
						'<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=' + change.doc.data().font +'">'
					);
				} catch (err) {
					console.log("Font application error: " + err);
				}
			} else {
				console.log("Font " + change.doc.data().font + " already linked");
			}
			
			$(".module[data-moduleid=" + doc.id + "] .element[data-element=" + change.doc.id + "]").delay(change.doc.data().delayIn).animate(animationArray[change.doc.data().animationIn], change.doc.data().durationIn);
			
			//Play video
			playVideo(doc.id, change.doc.id, change.doc.data().webmFreeze, change.doc.data().webmdelay, change.doc.data().webmduration);
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

//textFit(document.getElementsByClassName('element'), {minFontSize:10, maxFontSize: 50});