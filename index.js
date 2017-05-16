const db = require('./models/index');

db.connect().then(() => {
  console.log('Connection has been established successfully.');
}).catch((e) => {
  console.log('could not connect ', e)
})

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