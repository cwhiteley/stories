const path = require('path');
const assert = require('assert');
const request = require('supertest');
const setup = require('./setup');
let app, server, token;

describe.only('Integration Tests', function() {

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
                .send({'query': 'mutation { storyFragmentAdd(userId: 1, date:"Thu Jun 08 2017", url:"some.jpg") {storyId,url}}'})
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
                    .send({'query': 'mutation { commentAdd(storyId:1, userId:1, comment:"this") {  id, comment }}'})
                    .expect(200)
                    .end((err, res) => {
                        console.log(res.body.data.commentAdd);
                        done();
                    });
            }
        });

    });
});