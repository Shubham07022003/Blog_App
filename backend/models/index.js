const { Sequelize } = require('sequelize');
const config = require('../config/database');

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    dialect: 'mysql',
    logging: false,
  }
);

const db = {
  sequelize,
  Sequelize,
  User: require('./user')(sequelize, Sequelize),
  Post: require('./post')(sequelize, Sequelize),
  Comment: require('./comment')(sequelize, Sequelize),
};

// Define associations
db.User.hasMany(db.Post, { foreignKey: 'authorId' });
db.Post.belongsTo(db.User, { foreignKey: 'authorId', as: 'author' });

db.User.hasMany(db.Comment, { foreignKey: 'authorId' });
db.Comment.belongsTo(db.User, { foreignKey: 'authorId', as: 'author' });

db.Post.hasMany(db.Comment, { foreignKey: 'postId' });
db.Comment.belongsTo(db.Post, { foreignKey: 'postId' });

module.exports = db; 