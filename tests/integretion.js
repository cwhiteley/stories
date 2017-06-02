const request = require('supertest');
const path = require('path');
const assert = require('assert');
var db = require('../src/models');
let app, server, token;

describe('Integration Tests', function() {

    before(function(done) {
        db.connect().then(()=> { 
            done();
        }).catch((e) => {
            done();
        })
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

    describe('Adding user', function() {
        it('should send a 200', function(done) {
            server
                .post('/graphql?token=' + token)
                .send({"query": "query {user(id: 1) {facebookID,username,name,description}}"})
                .expect(200)
                .then(res => {
                    console.log(res.body);
                    assert(res.body.data.user.name, 'David')
                    done();
                })
        });

    });
});

//{"query": "query {user(id: 1) {username,name,story {id date storyfragments {url}}}}"}