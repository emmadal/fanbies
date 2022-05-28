const mysql = require('mysql');
require('dotenv').config({ path: './.env' });
const connection = mysql.createConnection({
  host     : 'fanbiesdb.ci3idbas7bxd.eu-west-2.rds.amazonaws.com',
  user     : 'dondada',
  password : 'Club123!',
  database : 'db571358343',
  DB_prefix : 'nolly_'
	//   host     : 'localhost',
	//   user     : 'root',
	//   password : 'root',
	//   database : 'db571358343',
	//   DB_prefix : 'nolly_'
});
 

connection.connect(function(error){
	if(!!error){
		console.log('Unable to connect to Database.' , error)
		return
	} else{
		console.log('Connection Made')
	}
});

//connection.end();


module.exports = connection;