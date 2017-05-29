var express = require('express');
const jwt = require('jsonwebtoken');
var router = express.Router();
const { sequelize: { models } } = require('../src/models.js');
const  { jwt: {secret} } = require('../config');
   
//shouldnt use facebook as param, just use what the facebook API returns 
function facebookGraphCall() {
    //use auth token to get facebookID
    return '001';
}

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
    const facebookID = facebookGraphCall();
    models.users.find({
        where: {
            facebookID: facebookID
        },
        raw: true
    }).then((result) => { 
        if (result) {
            return createJWToken(res, result.id);
        }
        return models.users.create({
            name: 'Rippley',
            username: 'ripley005',
            facebookID: facebookID,
            description: 'robot model #5',
            followers: [1, 2, 3]
        }).then((newUser) => {
            const newUserId = newUser.get({plain: true}).id;
            return createJWToken(res, newUserId);
        }).catch((err) => {
            return next({
                msg: `unable to create user with facebookID ${facebookID}`,
                statusCode: 500,
                err
            });            
        });
    }).catch((err) => {
        return next({
            msg: `unable to query user with id ${facebookID}`,
            statusCode: 500,
            err
        });
    });
});

module.exports = router;
