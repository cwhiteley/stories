const db = require('./models/index');

db.connect().then(() => {
  console.log('Connection has been established successfully.');
}).catch((e) => {
  console.log('could not connect ', e)
})

// sequelize
//   .authenticate()
//   .then(err => {
//     console.log('Connection has been established successfully.');
//     Promise.all([
//       User.sync({
//         force: true
//       }),
//       Story.sync({
//         force: true
//       }),
//       Stories.sync({
//         force: true
//       }),
//       Comments.sync({
//         force: true
//       })      
//     ]).then(() => {
//       createUsers();
//     });
//   })
//   .catch(err => {
//     console.error('Unable to connect to the database:', err);
//   });

// function createUsers() {
//   User.bulkCreate([{
//     name: 'David',
//     username: 'david001',
//     facebookID: '001',
//     description: 'robot model #1',
//   }, {
//     name: 'Walter',
//     username: 'walter001',
//     facebookID: '002',
//     description: 'robot model #2',
//   }]).then(() => {
//     return User.findAll();
//   }).then((users) => {
//     Story.bulkCreate([{
//       date: new Date(),
//       userId: users[0].id
//     },{
//       date: new Date(),
//       userId: users[0].id
//     }]);
//   });
// }