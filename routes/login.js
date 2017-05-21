var express = require('express');
var router = express.Router();
const { sequelize: { models } } = require('../models/index.js');


router.get('/:facebookID', function (req, res, next) {
    models.users.find({
        where: {
            facebookID: req.params.facebookID
        },
       raw: true
    }).then((result) => {
        res.json(result)
    }).catch((err) => {
        return next({
            msg: `unable to query user with id ${facebookid}`,
            statusCode: 500,
            err
        });
    });
});

module.exports = router;
