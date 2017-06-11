const express = require('express');
const jwt = require('jsonwebtoken');
const { sequelize: { models } } = require('../src/models.js');
const { jwt: { secret } } = require('../src/utils/config');
const facebook = require('../src/utils/facebook');

const router = express.Router();

function createJWToken(res, userObj) {
    const user = {
        id: userObj.id
    };
    const token = jwt.sign(user, secret);
    return res.json({
        token
    });
}

router.get('/', (req, res, next) => {
    const facebookUser = facebook.init();
    models.users
    .findOrCreate({ where: { facebookID: facebookUser.facebookID }, defaults: facebookUser })
    .spread((theUser, created) => {
        const theUserObj = theUser.get({
            plain: true
        });
        return createJWToken(res, theUserObj);
    }).catch((err) => {
        return next({
            msg: `unable to find or create user with facebookID ${facebookUser.facebookID}`,
            statusCode: 500,
            err
        });
    });
});

module.exports = router;
