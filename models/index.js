const path = require('path');
const Sequelize = require('sequelize');
const config = require('../config');
const {database: { database, username, password, host}} = config;
const sequelize = new Sequelize(database, username, password, {
  host: host,
  dialect: 'postgres',
  logging: console.log,
  pool: {
    max: 5,
    min: 0,
    idle: 10000
  }
});

let db = {
    Users: sequelize.import(path.join(__dirname, './users')),
    Story: sequelize.import(path.join(__dirname, './story')),
    Stories: sequelize.import(path.join(__dirname, './stories')),
    Comments: sequelize.import(path.join(__dirname, './comments'))
};

Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

function syncModels() {
    console.log('syncing');
    const overwrite = {
        force: true
    };

    return Promise.all([
        db.Users.sync(overwrite),
        db.Story.sync(overwrite),
        db.Stories.sync(overwrite),
        db.Comments.sync(overwrite)
    ]);
}

db.connect = function () {
    console.log('connecting');
    return sequelize.authenticate().then(syncModels);
}

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;