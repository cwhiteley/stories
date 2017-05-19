const path = require('path');
const Sequelize = require('sequelize');
const config = require('../config');
const {database: { dbname, username, password, host}} = config;
const sequelize = new Sequelize(dbname, username, password, {
  host: host,
  dialect: 'postgres',
  logging: false,
  pool: {
    max: 5,
    min: 0,
    idle: 10000
  }
});

let db = {
    users: sequelize.import(path.join(__dirname, './users')),
    story: sequelize.import(path.join(__dirname, './story')),
    stories: sequelize.import(path.join(__dirname, './stories')),
    comments: sequelize.import(path.join(__dirname, './comments'))
};

Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

db.connect = function () {
    return sequelize.authenticate().then(()=> {
        return sequelize.sync({
            force: false
        });
    });
};

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;