require('dotenv').config();

module.exports = {
  host: process.env.MYSQLHOST ,
  username: process.env.MYSQLUSER ,
  password: process.env.MYSQLPASSWORD ,
  database: process.env.MYSQLDATABASE ,
  dialect: 'mysql',
  logging: false,
}; 