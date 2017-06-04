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
                    facebookID: '001',
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
        it('should generate a JWT token', function(done) {
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
        it('should return a user', function(done) {
            server
                .post('/graphql?token=' + token)
                .send({"query": "query {user(id: 1) {facebookID,username,name,description}}"})
                .expect(200)
                .end((err, res) => {
                    assert.equal(res.body.data.user.name, 'Rippley')
                    done();
                })
        });

    });
});