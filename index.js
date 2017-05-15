const Sequelize = require('Sequelize');
const config = require('./config');
const {
  database: {
    db,
    username,
    password,
    host
  }
} = config;
const sequelize = new Sequelize(db, username, password, {
  host: host,
  dialect: 'postgres',
  logging: console.log,
  pool: {
    max: 5,
    min: 0,
    idle: 10000
  }
});

const User = sequelize.define('users', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  facebookID: {
    type: Sequelize.STRING
  },
  name: {
    type: Sequelize.STRING
  },
  username: {
    type: Sequelize.STRING
  },
  description: {
    type: Sequelize.STRING
  },
  followers: {
    type: Sequelize.ARRAY(Sequelize.INTEGER),
    allowNull: true
  }
});

const Story = sequelize.define('story', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  date: {
    type: Sequelize.DATE
  },
  likedby: {
    type: Sequelize.ARRAY(Sequelize.INTEGER)
  }
}, {
  freezeTableName: true
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
    type: Sequelize.STRING
  },
  viewedby: {
    type: Sequelize.ARRAY(Sequelize.INTEGER)
  }
});


const Comments = sequelize.define('comments', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  date: {
    type: Sequelize.DATE
  },
  comment: {
    type: Sequelize.TEXT
  }
});

User.hasMany(Story)
Story.belongsTo(User)
Story.hasMany(Stories);
Stories.belongsTo(Story)
Story.hasMany(Comments);
Comments.belongsTo(Story)

sequelize
  .authenticate()
  .then(err => {
    console.log('Connection has been established successfully.');
    Promise.all([
      User.sync({
        force: true
      }),
      Story.sync({
        force: true
      }),
      Stories.sync({
        force: true
      }),
      Comments.sync({
        force: true
      })      
    ]).then(() => {
      createUsers();
    });
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

function createUsers() {
  User.bulkCreate([{
    name: 'David',
    username: 'david001',
    facebookID: '001',
    description: 'robot model #1',
  }, {
    name: 'Walter',
    username: 'walter001',
    facebookID: '002',
    description: 'robot model #2',
  }]).then(() => {
    return User.findAll();
  }).then((users) => {
    Story.bulkCreate([{
      date: new Date(),
      userId: users[0].id
    },{
      date: new Date(),
      userId: users[0].id
    }]);
  });
}