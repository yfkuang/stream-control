/*--------------
//Firebase Authorization
--------------*/
//Require Dependencies. Placed here or undefined variable errors otherwise.
var firebase = require('firebase/app');
require('firebase/auth');
require('firebase/firestore');

function login (){
	var userEmail = $('input[name=email]').val();
	var userPassword = $('input[name=password]').val();
	
	firebase.auth().signInWithEmailAndPassword(userEmail, userPassword).catch(function(error) {
	  // Handle Errors here.
	  	var errorCode = error.code;
	  	var errorMessage = error.message;
	  	// ...
		console.log('Login info is incorrect');
	});
	
	firebase.auth().onAuthStateChanged(function(user) {
		if (user) {
			// User is signed in.
			firebase.auth().currentUser.getIdToken().then(function (response){
				$('input[name="tokenID"]').val(response);
				var dbUser = firebase.firestore().collection('users').doc(user.uid);
				dbUser.get().then(function(doc) {
					if (doc.exists) {
						console.log("Pre-existing User");
					} else {
						// Creates new user
						firebase.firestore().collection('users').doc(user.uid).set({email: user.email});//Set user to Firestore
						console.log("New User");
					}
				}).catch(function(error) {
					console.log("Error getting document:", error);
				});
				$('.login-form').submit();
				//console.log(response);
			});
	  } else {
		// No user is signed in.
		console.log('Login failed');
	  }
	});
}

function logout(){
	firebase.auth().signOut().then(function (response){
		$('input[name="tokenID"]').val('logout');
		$('.logout-form').submit();
		//console.log($(response);
	});
}

$(document).ready(function(){//Initialize Event Listeners
	
	/*--------------
	//Firebase Client-side authentication
	--------------*/
	// Initialize Firebase
	var config = {
		apiKey: process.env.MIX_FIREBASE_API,
		authDomain: process.env.MIX_FIREBASE_AUTH_DOMAIN,
		databaseURL: process.env.MIX_FIREBASE_DATABASE_URI,
		projectId: process.env.MIX_FIREBASE_PROJECT_ID,
		storageBucket: process.env.MIX_FIREBASE_STORAGE_BUCKET,
		messagingSenderId: process.env.MIX_FIREBASE_MESSAGING_SENDER_ID
	};
	firebase.initializeApp(config);
	
	$('.login').click(function(){
		login();
	});
	
	$('.logout').click(function(){
		logout();
	});
	
});