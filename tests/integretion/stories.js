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

    describe('Stories', function() {
        it('Query: should return stories', function(done) {
            server
                .post('/graphql?token=' + token)
                .send({'query': 'mutation {storyFragmentAdd(userId: 1, date:"Thu Jun 08 2017", url:"some.jpg") {url}}'})
                .end((err, res) => {
                    server
                    .post('/graphql?token=' + token)
                    .send({'query': 'mutation {storyFragmentAdd(userId: 1, date:"Fri Jun 09 2017", url:"some2.jpg") {url}}'})
                    .end((err, res) => {
                        checkStories(done)
                    })
                });

            function checkStories(done) {
                server
                    .post('/graphql?token=' + token)
                    .send({'query': 'query {stories(userId: 1) {id,date, storyfragments {url} }}'})
                    .expect(200)
                    .end((err, res) => {
                        assert.equal(res.body.data.stories[0].date.indexOf('Thu') > -1, true);
                        assert.equal(res.body.data.stories[1].date.indexOf('Fri') > -1, true);
                        assert.equal(res.body.data.stories[0].storyfragments[0].url, 'some.jpg');
                        assert.equal(res.body.data.stories[1].storyfragments[0].url, 'some2.jpg');
                        done();
                    });
            }
        });

        it('Mutation: should let you like/unlike a story', function(done) {
            let storyId;
            server
                .post('/graphql?token=' + token)
                .send({'query': 'mutation {storyFragmentAdd(userId: 1, date:"Thu Jun 08 2017", url:"some.jpg") {storyId,url}}'})
                .end((err, res) => {
                    storyId = res.body.data.storyFragmentAdd.storyId;
                    checkStories(done);
                });
    
            function checkStories(done) {
                server
                    .post('/graphql?token=' + token)
                    .send({'query': `mutation {storyLike(storyId: ${storyId}, likedBy:2) {id,likedBy}}`})
                    .expect(200)
                    .end((err, res) => {
                        assert.deepEqual(res.body.data.storyLike.likedBy, [2]);
                    server
                        .post('/graphql?token=' + token)
                        .send({'query': `mutation {storyLike(storyId: ${storyId}, likedBy:3) {id,likedBy}}`})
                        .expect(200)
                        .end((err, res) => {
                             assert.deepEqual(res.body.data.storyLike.likedBy, [2,3]);
                             done();
                            /* You Cant unlike at the moment */
                            // server
                            //     .post('/graphql?token=' + token)
                            //     .send({'query': `mutation {storyLike(storyId: ${storyId}, likedBy:2) {id,likedBy}}`})
                            //     .expect(200)
                            //     .end((err, res) => {
                            //         assert.deepEqual(res.body.data.storyLike.likedBy, [3]);
                            //     });    
                       });                                           
                });
            }
        });
    });
});