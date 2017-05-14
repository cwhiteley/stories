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


  const User = sequelize.define('users', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: Sequelize.STRING
    },
    username: {
      type: Sequelize.STRING
    },
    facebookID: {
      type: Sequelize.STRING
    },
    description: {
      type: Sequelize.STRING
    }
  });

  const Stories = sequelize.define('stories', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    date: {
      type: Sequelize.DATE
    },
    url: {
      type: Sequelize.STRING,
    }
  });

User.hasMany(Stories)
Stories.belongsTo(User)

sequelize.sync();

//  User.create({
//     name: 'Davids',
//     facebookID: '001',
//     description: 'robot model #1'
//   });

  // Stories.create({
  //   userId: 4,
  //   date: new Date(),
  //   url: '/aws/some2.jpg'
  // });


User.findAll({
  include: [{
    model: Stories
  }]
}).then((s) => {
  console.log(s)
}).catch((s) => {
  console.log(s)
})