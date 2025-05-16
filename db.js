// db.js
const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'luchas1.',
  database: 'sistemaasesoria'
});

module.exports = db;
