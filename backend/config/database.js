require('dotenv').config();

module.exports = {
  host: process.env.MYSQLHOST || 'localhost',
  username: process.env.MYSQLUSER || 'root',
  password: process.env.MYSQLPASSWORD || '',
  database: process.env.MYSQLDATABASE || 'blog_db',
  dialect: 'mysql',
  logging: false,
}; 