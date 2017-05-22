var express = require('express');
const jwt = require('jsonwebtoken');
var router = express.Router();
const { sequelize: { models } } = require('../models/index.js');
const  { jwt: {secret} } = require('../config');
   
router.get('/:facebookID', function (req, res, next) {
    models.users.find({
        where: {
            facebookID: req.params.facebookID
        },
       raw: true
    }).then((result) => {
        const user = {
            id: result.id
        };
        const token = jwt.sign(user, secret);
        return res.json({token});
    }).catch((err) => {
        return next({
            msg: `unable to query user with id ${req.params.facebookID}`,
            statusCode: 500,
            err
        });
    });
});

module.exports = router;
