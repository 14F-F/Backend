const mysql = require('mysql');

const connection = mysql.createPool({
    host: '45.67.159.35',
    user: 'root',
    password: 'admin1',
    database: 'edutron'
});

module.exports = connection;
