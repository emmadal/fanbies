const admin = require('firebase-admin');
const serviceAuth = require('../fanbies-firebase-adminsdk-q5h8q-17dd86f350.json')


admin.initializeApp({
	credential: admin.credential.cert(serviceAuth),
  	databaseURL: 'https://fanbies.firebaseio.com'
})


/**
 * Firebase Push Messages
 */

function firebase(token,payload,options) {
	admin.messaging().sendToDevice(token,payload,options)
	.then(function(response) {
		console.log('--Successfully sent message: --', response);
	})
	.catch(function(error) {
		console.log('Error sending message:', error);
	});
}

module.exports = firebase;

