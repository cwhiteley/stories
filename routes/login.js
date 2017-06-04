var express = require('express');
const jwt = require('jsonwebtoken');
var router = express.Router();
const { sequelize: { models } } = require('../src/models.js');
const  { jwt: {secret} } = require('../src/utils/config');
const facebook = require('../src/utils/facebook');

function createJWToken(res, id) {
    const user = {
        id
    };
    const token = jwt.sign(user, secret);
    return res.json({
        token
    });
}

router.get('/', function (req, res, next) {
    const facebookUser = facebook.init();
    models.users
    .findOrCreate({where: {facebookID: facebookUser.facebookID}, defaults: facebookUser})
    .spread((newUser, created) => {
         const newUserId = newUser.get({
            plain: true
        }).id;
        return createJWToken(res, newUserId);
    }).catch((err) => {
        return next({
            msg: `unable to find or create user with facebookID ${facebookID}`,
            statusCode: 500,
            err
        });
    });    
});

module.exports = router;
