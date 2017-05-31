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
    users: sequelize.import(path.join(__dirname, '/users/models')),
    stories: sequelize.import(path.join(__dirname, '/stories/models')),
    storyfragments: sequelize.import(path.join(__dirname, '/storyfragments/models')),
    comments: sequelize.import(path.join(__dirname, '/comments/models'))
};

Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

db.connect = function () {
    return sequelize.authenticate().then(()=> {
        return sequelize.sync({
            force: true
        }).then(()=> {
          //  createUsers();
        });
    });
};

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;


function createUsers() {
  const today = new Date();
  sequelize.models.users.bulkCreate([{
    name: 'David',
    username: 'david001',
    facebookID: '001',
    description: 'robot model #1'
  }, {
    name: 'Walter',
    username: 'walter001',
    facebookID: '002',
    description: 'robot model #2'
  }, {
    name: 'Elizabeth',
    username: 'liz',
    facebookID: '003',
    description: 'shes real'
  }]).then(() => {
    return sequelize.models.users.findAll();
  }).then((users) => {
    return sequelize.models.stories.bulkCreate([{
      date: today,
      userId: users[0].id,
      likedBy: [2]
    },{
      date: today,
      userId: users[1].id
    },{
      date: today,
      userId: users[2].id,
      likedBy: [1,2]
    }]).then((story)=> { 
      return sequelize.models.storyfragments.bulkCreate([{
            date: today,
            storyId: 1,
            url: 'http://www.google.com/',
            viewedBy: [1,2]
          },{
            date: today,
            storyId: 1,
            url: 'http://www.google.com/',
            viewedBy: [1,2]
          }]);
    }).then((story)=> {
        test();
    });
  });
}

function test() { //findOne
  

}

