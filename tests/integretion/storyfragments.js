const request = require('supertest');
var proxyquire =  require('proxyquire');
const path = require('path');
const assert = require('assert');
var db = require('../../src/models');
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
        it('Query: should return story fragments', function(done) {
            let result = [];
            const postQuery = '/graphql?token=' + token;
            const storyFragmentAddMutation = {'query': 'mutation {storyFragmentAdd(userId: 1, date:"Thu Jun 08 2017", url:"some.jpg") {storyId, url}}'};
            server
                .post(postQuery)
                .send(storyFragmentAddMutation)
                .end((err, res) => {
                    const {url, storyId} = res.body.data.storyFragmentAdd;
                    result.push({storyId, url});
                    server
                        .post(postQuery)
                        .send(storyFragmentAddMutation)
                        .end((err, res) => {
                            const {url, storyId} = res.body.data.storyFragmentAdd;
                            result.push({storyId,url});                        
                        server
                        .post(postQuery)
                        .send({'query': 'query {storyfragments(storyId: 1) {storyId,url}}'})
                        .expect(200)
                        .end((err, res) => {
                            assert.deepEqual(res.body.data.storyfragments, result);
                            done();
                        });
                    });
                });
        });

        it('Mutation: should add a new story fragment', function(done) {
            let createdStoryId;
            server
                .post('/graphql?token=' + token)
                .send({'query': 'mutation {storyFragmentAdd(userId: 1, date:"Thu Jun 08 2017", url:"some.jpg") {storyId,url}}'})
                .expect(200)
                .end((err, res) => {
                    const {url, storyId} = res.body.data.storyFragmentAdd;
                    assert.equal(url, 'some.jpg');
                    createdStoryId = storyId;
                    shouldAddFragmentoSameStory(done);
                });

                function shouldAddFragmentoSameStory(done){
                    server
                        .post('/graphql?token=' + token)
                        .send({'query': 'mutation {storyFragmentAdd(userId: 1, date:"Thu Jun 08 2017", url:"some2.jpg") {storyId,url}}'})
                        .expect(200)
                        .end((err, res) => {
                            const {url, storyId} = res.body.data.storyFragmentAdd;
                            assert.equal(url, 'some2.jpg');
                            assert.equal(storyId, createdStoryId);
                            done();
                        });
                }
        });

        it('Mutation: view a story fragment', function (done) {
            let storyFragId;
            server
                .post('/graphql?token=' + token)
                .send({'query': 'mutation {storyFragmentAdd(userId: 1, date:"Thu Jun 08 2017", url:"some.jpg") {id, storyId,url}}'})
                .expect(200)
                .end((err, res) => {
                    const {url, id} = res.body.data.storyFragmentAdd;
                    assert.equal(url, 'some.jpg');
                    storyFragId = id;
                    viewStoryFragment(done);

                    function viewStoryFragment(done) {
                        server
                            .post('/graphql?token=' + token)
                            .send({'query': `mutation {storyFragmentView(storyFragId: ${storyFragId}, viewedBy:3) {storyId,url,viewedBy}}`})
                            .end((err, res) => {
                                server
                                    .post('/graphql?token=' + token)
                                    .send({'query': 'mutation {storyFragmentView(storyFragId: 1, viewedBy:2) {storyId,url,viewedBy}}'})
                                    .expect(200)
                                    .end((err, res) => {
                                        const {url, viewedBy} = res.body.data.storyFragmentView;
                                        assert.equal(url, 'some.jpg');
                                        assert.deepEqual(viewedBy, [3, 2]);
                                        done();
                                    });
                            });
                    }
                });
        });


    });
});