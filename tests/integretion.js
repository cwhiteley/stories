const request = require('supertest');
var proxyquire =  require('proxyquire');
const path = require('path');
const assert = require('assert');
var db = require('../src/models');
let app, server, token;

describe('Integration Tests', function() {

    before(function(done) {
        const facebookStub = {
            init: function () {
                return {
                    name: 'Rippley',
                    username: 'ripley005',
                    facebookID: '000',
                    description: 'robot model #5'
                }
            }
        };


        proxyquire(path.join(__dirname, '../', 'routes', 'login.js'), {
            '../src/utils/facebook': facebookStub
        });

        db.connect().then(()=> { 
            done();
        }).catch((e) => {
            done();
        });
    });

    beforeEach(function(done) {
        app = require(path.join(__dirname, '../', 'server.js'));
        server = request(app);
        done();
    });

    describe('Login', function () {
        it('should find or create mocked user and generate a JWT token', function(done) {
            server
            .get('/login')
            .then(res => {
                token = res.body.token;
                assert.notEqual(token, null);
                done();
            });
        });
    });

    describe('Users', function() {
        
        before(function() {
            db.sequelize.models.users.bulkCreate([{
                name: 'David',
                username: 'david001',
                facebookID: '001',
                description: 'robot model #1'
            }, {
                name: 'Walter',
                username: 'walter001',
                facebookID: '002',
                description: 'robot model #2'
            }, {
                name: 'Elizabeth',
                username: 'liz',
                facebookID: '003',
                description: 'shes real'
            }]);
        });
        
        it('Query: should return a user', function(done) {
            server
                .post('/graphql?token=' + token)
                .send({'query': 'query {user(id: 1) {facebookID,username,name,description}}'})
                .expect(200)
                .end((err, res) => {
                    assert.equal(res.body.data.user.name, 'Rippley');
                    assert.equal(res.body.data.user.username, 'ripley005');
                    assert.equal(res.body.data.user.facebookID, '000');
                    assert.equal(res.body.data.user.description, 'robot model #5');
                    done();
                })
        });

        it('Mutation: should let you update user details', function(done) {
            server
                .post('/graphql?token=' + token)
                .send({'query': 'mutation {userUpdateDetails(userId: 1, name:"FakeRipley", desc:"whatever", username:"ripleyclone22") {facebookID,username,name,description}}'})
                .expect(200)
                .end((err, res) => {

                    assert.equal(res.body.data.userUpdateDetails.name, 'FakeRipley');
                    assert.equal(res.body.data.userUpdateDetails.username, 'ripleyclone22');
                    assert.equal(res.body.data.userUpdateDetails.description, 'whatever');
                    done();
                })            
        });

    });
});