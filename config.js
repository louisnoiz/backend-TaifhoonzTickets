const mysql = require('mysql2/promise');
const dbPassword = process.env.DB_PASSWORD;
const dbName = process.env.DB_NAME;

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: dbPassword,
  database: dbName,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;