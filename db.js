// db.js

const mysql = require('mysql2');
require('dotenv').config({ path: '../.env' });

const db = mysql.createConnection({
    // {{{{       MODIFICAR CREDENCIALES SEGUN SEA EL CASO      }}}}
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

module.exports = db;
