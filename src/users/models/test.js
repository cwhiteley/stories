const assert = require('assert');
const db = require('../../models');

describe('User Model', function () {
    let userResult;

    before(function (done) {
        db.connect().then(function() {
            done();
        });
    })
    
    beforeEach(function (done) {
        db.sequelize.models.users.create({
            name: 'David',
            username: 'david001',
            facebookID: '001',
            description: 'robot model #1'
        }).then((result) => {
            userResult = result.dataValues;
            done();
        });
    });
    
    describe('Creation', function () {
        it('details should be correct', function (done) {
            assert.equal(userResult.name, 'David');
            done();
        });
    });
});