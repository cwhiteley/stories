var express = require('express');
var router = express.Router();
const graphqlHTTP = require('express-graphql');
const { query } = require('../graphql/query');
const jwt = require('express-jwt');

router.use(jwt({
  secret: 'tempSecret',
  credentialsRequired: true,
  getToken: function fromHeaderOrQuerystring (req) {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        return req.headers.authorization.split(' ')[1];
    } else if (req.query && req.query.token) {
      return req.query.token;
    }
    return null;
  }
}));

router.use('/', graphqlHTTP({
    schema: query,
    rootValue: root,
    graphiql: true,
}));

module.exports = router;

