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

    describe('Comments', function() {
        it('Mutation: should add a comment for a story', function(done) {
            let createdStoryId;
            server
                .post('/graphql?token=' + token)
                .send({'query': 'mutation { storyFragmentAdd(userId:1, date:"Thu Jun 08 2017", url:"some.jpg") {storyId,url}}'})
                .expect(200)
                .end((err, res) => {
                    const {url, storyId} = res.body.data.storyFragmentAdd;
                    assert.equal(url, 'some.jpg');
                    createdStoryId = storyId;
                    addComment(done);
                });

            function addComment(done) {
                server
                    .post('/graphql?token=' + token)
                    .send({'query': `mutation { commentAdd(storyId:${createdStoryId}, userId:1, comment:"this is a comment") {  id, comment, user { username } }}`})
                    .expect(200)
                    .end((err, res) => {
                        const {comment, user} = res.body.data.commentAdd;
                        assert.equal(comment, 'this is a comment');
                        assert.deepEqual(user, [{"username": "david001"}]);
                        done();
                    });
            }
        });

            it('should be able to query comments', function (done) {
                let createdStoryId;
                server
                    .post('/graphql?token=' + token)
                    .send({'query': 'mutation { storyFragmentAdd(userId:1, date:"Thu Jun 08 2017", url:"some.jpg") {storyId,url}}'})
                    .expect(200)
                    .end((err, res) => {
                        const {url, storyId} = res.body.data.storyFragmentAdd;
                        assert.equal(url, 'some.jpg');
                        createdStoryId = storyId;
                        addComment(done);
                    });

                function addComment(done) {
                    server
                        .post('/graphql?token=' + token)
                        .send({'query': `mutation { commentAdd(storyId:${createdStoryId}, userId:1, comment:"this is a comment") {  id, comment, user { username } }}`})
                        .expect(200)
                        .end((err, res) => {
                            queryComment(done);
                        });
                }


                function queryComment(done) {
                    server
                        .post('/graphql?token=' + token)
                        .send({'query': `query { comments(storyId:${createdStoryId}) {comment,user { username } }}`})
                        .expect(200)
                        .end((err, res) => {
                            const {comment, user} = res.body.data.comments[0];
                            assert.equal(comment, 'this is a comment');
                            assert.deepEqual(user, [{"username": "david001"}]);
                            done();
                        });
                }
            });        

    });
});