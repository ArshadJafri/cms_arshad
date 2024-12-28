const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',    // MySQL username
  password: 'SboaWStu$2017', // MySQL password
  database: 'axr4477_cms' // Your database name
});

module.exports = pool.promise();