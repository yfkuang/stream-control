/*--------------
//Firebase Authorization
--------------*/
var token = $('meta[name="token"]').attr('data');

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
	
	firebase.auth().onAuthStateChanged(function(user) {
		if (user) {
			firebase.auth().currentUser.getIdToken().then(function (response){//Keep user from getting timed out
				$('meta[name="token"]').val(response);

				//console.log(response);
			}).catch(function(error){
				console.log('Could not retrieve token ID.');
			});
		} else {
			logout();
		}
	});
	
	$('.login').click(function(){
		login();
	});
	
	$('.login-form').on('keypress',function(e) {
		if(e.which == 13) {
			login();
		}
	});
	
	$('.logout').click(function(){
		logout();
	});
	
});