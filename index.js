const Sequelize = require('Sequelize');
const config = require('./config');
const {database: { db, username, password, host}} = config;
const sequelize = new Sequelize(db, username, password, {
  host: host,
  dialect: 'postgres',
  pool: {
    max: 5,
    min: 0,
    idle: 10000
  }
});

sequelize
  .authenticate()
  .then(err => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });