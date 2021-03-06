const path = require('path');
const assert = require('assert');
const request = require('supertest');
const setup = require('./setup');
let app, server, token;
       const {graphql} = require('graphql');
            const schema = require('../../src/schema.js');
describe('Integration Tests', function() {

    beforeEach(function(done) {
        setup().then(() => {
            app = require(path.join(__dirname, '../', '../', 'server.js'));
            server = request(app);
            done();
        });
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
        it('Query: should return a user', function(done) {
            server
                .post('/graphql?token=' + token)
                .send({'query': 'query {user(id: 1) {facebookID,username,name,description}}'})
                .expect(200)
                .end((err, res) => {
                    const {name, username, facebookID, description} = res.body.data.user;
                    assert.equal(name, 'David');
                    assert.equal(username, 'david001');
                    assert.equal(facebookID, '001');
                    assert.equal(description, 'robot model #1');
                    done();
                })
        });

        it('Mutation: should let you update user details', function(done) {
            server
                .post('/graphql?token=' + token)
                .send({'query': 'mutation {userUpdateDetails(userId: 1, name:"FakeRipley", desc:"whatever", username:"ripleyclone22") {facebookID,username,name,description}}'})
                .expect(200)
                .end((err, res) => {
                    const {name, username, description} = res.body.data.userUpdateDetails;
                    assert.equal(name, 'FakeRipley');
                    assert.equal(username, 'ripleyclone22');
                    assert.equal(description, 'whatever');
                    done();
                })            
        });


        it('Mutation: should let you follow/unfollow a user', function(done) {
            server
                .post('/graphql?token=' + token)
                .send({'query': 'mutation {userFollow(userId: 3, followingId:1, type:"follow") {following}}'})
                .expect(200)
                .end((err, res) => {
                    const {following} = res.body.data.userFollow;
                    assert.deepEqual(following, [1]);
                    checkUserThatisFollowed(done)
                });

                function checkUserThatisFollowed(done) {
                    server
                        .post('/graphql?token=' + token)
                        .send({'query': 'query {user(id: 1) {followers}}'})
                        .expect(200)
                        .end((err, res) => {
                            const {followers} = res.body.data.user;
                            assert.deepEqual(followers, [3]);
                            unFollow(done)
                        });
                }                

                function unFollow(done) {
                    server
                        .post('/graphql?token=' + token)
                        .send({'query': 'mutation {userFollow(userId: 3, followingId:1, type:"unfollow") {following}}'})
                        .expect(200)
                        .end((err, res) => {
                            const {following} = res.body.data.userFollow;
                            assert.deepEqual(following, []);
                            checkUserThatisUnFollowed(done);
                        });
                }

                function checkUserThatisUnFollowed(done) {
                    server
                        .post('/graphql?token=' + token)
                        .send({'query': 'query {user(id: 1) {followers}}'})
                        .expect(200)
                        .end((err, res) => {
                            const {followers} = res.body.data.user;
                            assert.deepEqual(followers, []);
                            done();
                        });
                }
        });


    });
});