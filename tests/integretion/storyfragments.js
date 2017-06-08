const path = require('path');
const assert = require('assert');
const request = require('supertest');
const setup = require('./setup');
let app, server, token;

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