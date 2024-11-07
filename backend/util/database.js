const mysql = require('mysql2');

const config = require('../config/config.json');

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '12345',
  database: process.env.DB_DATABASE || 'prueba-Mederi'
});

module.exports = pool.promise();