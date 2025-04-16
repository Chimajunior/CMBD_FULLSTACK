// const mysql = require('mysql2');
// require('dotenv').config();

// const pool = mysql.createPool({
//   host: process.env.DB_HOST,
//   port: process.env.DB_PORT || 3306,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
// }).promise();

// const pool = mysql.createPool({
//   host: process.env.DB_HOST,
//   port: process.env.DB_PORT || 3306, // Make sure this line is here
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
// }).promise();




// const mysql = require('mysql2');
// require('dotenv').config();

// const pool = mysql.createPool({
//     host: process.env.DB_HOST,
//     port: process.env.DB_PORT || 3306,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME
// }).promise(); // Enables async/await

import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT|| 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default pool;


// pool.getConnection()
//   .then(() => console.log("✅ Connected to MySQL!"))
//   .catch(err => {
//     console.error("❌ MySQL connection failed:", err.message);
//   });

// module.exports = pool;




// module.exports = pool;
