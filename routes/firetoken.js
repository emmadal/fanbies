const express = require('express')
const firetoken = express.Router();
const firepush = require('../middleware/firepush');

/**
 * Test Firebase
 */

firetoken.post('/', (req, res) => {

	
	const token = 'cnIBhkaL1Fs:APA91bF8shUhYubInk6dbaPkO1W3ntzQ8-Drbj_KoK1qicHGB8CgVpQe-DxGUWW-KGKfTzI-Ori5zN3V153an3H2XZmwQCRVRQ40bRpO-WjH8GB0n9c7hqo6RDYBvWZq3aIuVIeF6zr6';

	const payload = {
		notification: {
			title: 'Incoming Call...',
			body: 'Adebayo Video call',
			sound: 'default'
		},
		data: {
			type: 'joinroom',
			page: 'userTask'
		}
	};

	const options = {
		priority: 'high',
		contentAvailable: true,
		timeToLive: 60 * 60 * 24
	};

	firepush(token,payload,options);

});



module.exports = firetoken;

