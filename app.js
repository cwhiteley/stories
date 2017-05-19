const express = require('express');
const graphqlHTTP = require('express-graphql');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const schema = require('./models/graphQLSchema');

// const index = require('./routes/index');
// const users = require('./routes/users');
// app.use('/', index);
// app.use('/users', users);

const app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error'); // wont work ! send status code ono
});

module.exports = app;


// db.connect().then(() => {
//   console.log('Connection has been established successfully.');
// }).catch((e) => {
//   console.log('could not connect ', e)
// })

// function createUsers() {
//   db.Users.bulkCreate([{
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
//     return db.Users.findAll();
//   }).then((users) => {
//     db.Story.bulkCreate([{
//       date: new Date(),
//       userId: users[0].id
//     },{
//       date: new Date(),
//       userId: users[0].id
//     }]).then(()=> { 
//       return db.Story.findAll();
//     });
//   });
// }