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
      type: Sequelize.ARRAY(Sequelize.INTEGER)
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

User.sync();
Story.sync();
Stories.sync();
Comments.sync();

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
  }
]).then(() => {
  return User.findAll();
}).then(users => {
  Story.bulkCreate([{
    date: new Date(),
    userId: users[0].id
  },{
    date: new Date(),
    userId: users[0].id
  }]);
});

//   Stories.create({
//     userId: 4,
//     date: new Date(),
//     url: '/aws/some2.jpg'
//   });


// User.findAll({
//   include: [{
//     model: Stories
//   }]
// }).then((s) => {
//   console.log(s)
// }).catch((s) => {
//   console.log(s)
// })