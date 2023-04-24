const mysql = require('mysql');

const connection = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '', 
	// in case of uploading to the FTP server, this will drop an authentication error message like this:
	// { "message": "MySQL is requesting the auth_gssapi_client authentication method, which is not supported."}
    database: 'edutron'
});

module.exports = connection;
