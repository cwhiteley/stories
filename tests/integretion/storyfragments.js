const request = require('supertest');
var proxyquire =  require('proxyquire');
const path = require('path');
const assert = require('assert');
var db = require('../../src/models');
let app, server, token;

describe.only('Integration Tests', function() {
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


        proxyquire(path.join(__dirname, '../', '../', 'routes', 'login.js'), {
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
            app = require(path.join(__dirname, '../', '../', 'server.js'));
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

    describe('StoryFragment', function() {
        it('Mutation: should add a new story fragment', function(done) {
            let createdStoryId;
            server
                .post('/graphql?token=' + token)
                .send({'query': 'mutation {storyFragmentAdd(userId: 1, date:"Thu Jun 08 2017", url:"some.jpg") {storyId,url}}'})
                .expect(200)
                .end((err, res) => {
                    assert.equal(res.body.data.storyFragmentAdd.url, 'some.jpg');
                    createdStoryId = res.body.data.storyFragmentAdd.storyId;
                    shouldAddFragmentoSameStory(done);
                });

                function shouldAddFragmentoSameStory(done){
                    server
                        .post('/graphql?token=' + token)
                        .send({'query': 'mutation {storyFragmentAdd(userId: 1, date:"Thu Jun 08 2017", url:"some2.jpg") {storyId,url}}'})
                        .expect(200)
                        .end((err, res) => {
                            assert.equal(res.body.data.storyFragmentAdd.url, 'some2.jpg');
                            assert.equal(res.body.data.storyFragmentAdd.storyId, createdStoryId);
                            done();
                        });
                }
        });

    });
});