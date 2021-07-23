var mysql = require('mysql');
var connection = mysql.createConnection({
	host:'localhost',
	user:'enzo',
	password:'bouta123',
	database:'project_watchlist'
});
connection.connect(function(error){
	if(!!error) {
		console.log(error);
	} else {
		console.log('Connected..!');
	}
});

module.exports = connection;