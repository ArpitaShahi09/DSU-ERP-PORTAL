const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Dsuds@9041', // Update if you have a password
  database: 'dsu_portal' // Make sure this matches your MySQL DB name
});

db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err.stack);
    return;
  }
  console.log('Connected to MySQL database as ID', db.threadId);
});

module.exports = db;
