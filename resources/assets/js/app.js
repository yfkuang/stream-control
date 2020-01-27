
/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */

/*Firebase Initialization*/
global.firebase = require('firebase/app');
require('firebase/auth');
require('firebase/firestore');
require('firebase/storage');

$(document).ready(function(){
	var firebaseConfig = {
		apiKey: process.env.MIX_FIREBASE_API,
		authDomain: process.env.MIX_FIREBASE_AUTH_DOMAIN,
		databaseURL: process.env.MIX_FIREBASE_DATABASE_URI,
		projectId: process.env.MIX_FIREBASE_PROJECT_ID,
		storageBucket: process.env.MIX_FIREBASE_STORAGE_BUCKET,
		messagingSenderId: process.env.MIX_FIREBASE_MESSAGING_SENDER_ID
	};
	firebase.initializeApp(firebaseConfig);
});

window.$ = window.jQuery = require('jquery');//Hack to prevent jQuery errors on custom Bootstrap functions
//window.Popper = require('popper.js');//Don't remember why this was included
require('bootstrap');
require('textfit');
require('./firebase-auth.js');
require('./dashboard.js');
require('./overlay.js');
//require('./modules.js');

//window.Vue = require('vue');

/**
 * Next, we will create a fresh Vue application instance and attach it to
 * the page. Then, you may begin adding components to this application
 * or customize the JavaScript scaffolding to fit your unique needs.
 */

/*Vue.component('example', require('./components/Example.vue'));

const app = new Vue({
    el: '#app'
});*/
