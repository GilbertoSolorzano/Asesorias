// db.js
const mysql = require('mysql2');

const db = mysql.createConnection({
    // {{{{       MODIFICAR CREDENCIALES SEGUN SEA EL CASO      }}}}
    host: 'localhost',
    user: 'root',
    password: 'gil1502',
    database: 'sistemaasesoria'
});

module.exports = db;
