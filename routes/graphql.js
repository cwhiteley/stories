var express = require('express');
var router = express.Router();
const graphqlHTTP = require('express-graphql');
const { schema } = require('../graphql/schema');

router.use('/',  graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));

module.exports = router;

