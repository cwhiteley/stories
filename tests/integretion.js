const request = require('supertest');
var proxyquire =  require('proxyquire');
const path = require('path');
const assert = require('assert');
var db = require('../src/models');
let app, server, token;

describe('Integration Tests', function() {

    beforeEach(function(done) {
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

        db.connect({force: true}).then(()=> {
            return populate().then(()=> {
                return connectServer().then(() => {
                    done();
                });
            });
        }).catch((e) => {
            console.log('Error connecting to DB/populating ', e);
            done();
        });

        function populate() {
            return db.sequelize.models.users.bulkCreate([{
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
            }])     
        }

        function connectServer() {
            app = require(path.join(__dirname, '../', 'server.js'));
            server = request(app);
            return Promise.resolve();
        }

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
                    assert.equal(res.body.data.user.name, 'David');
                    assert.equal(res.body.data.user.username, 'david001');
                    assert.equal(res.body.data.user.facebookID, '001');
                    assert.equal(res.body.data.user.description, 'robot model #1');
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


        it('Mutation: should let you follow/unfollow a user', function(done) {
            server
                .post('/graphql?token=' + token)
                .send({'query': 'mutation {userFollow(userId: 3, followingId:1, type:"follow") {following}}'})
                .expect(200)
                .end((err, res) => {
                    assert.deepEqual(res.body.data.userFollow.following, [1]);
                    checkUserThatisFollowed(done)
                });

                function checkUserThatisFollowed(done) {
                    server
                        .post('/graphql?token=' + token)
                        .send({'query': 'query {user(id: 1) {followers}}'})
                        .expect(200)
                        .end((err, res) => {
                            assert.deepEqual(res.body.data.user.followers, [3]);
                            unFollow(done)
                        });
                }                

                function unFollow(done) {
                    server
                        .post('/graphql?token=' + token)
                        .send({'query': 'mutation {userFollow(userId: 3, followingId:1, type:"unfollow") {following}}'})
                        .expect(200)
                        .end((err, res) => {
                            assert.deepEqual(res.body.data.userFollow.following, []);
                            checkUserThatisUnFollowed(done);
                        });
                }

                function checkUserThatisUnFollowed(done) {
                    server
                        .post('/graphql?token=' + token)
                        .send({'query': 'query {user(id: 1) {followers}}'})
                        .expect(200)
                        .end((err, res) => {
                            assert.deepEqual(res.body.data.user.followers, []);
                            done();
                        });
                }                  

                
        });           

    });
});