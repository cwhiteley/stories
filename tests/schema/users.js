const { expect } = require('chai');
const { graphql } = require('graphql');
const setup = require('../setup');
const schema = require('../../src/schema.js');

describe('User Schema', function() {

    beforeEach(async () => {
        await setup();
    });

    it('Query: Should return a user', async () => {
        const query = `
        { 
            user(id: 1) { 
                username
                facebookID,
                name,
                description,
                followers,
                following
            }
        }`;
        const result = await graphql(schema, query, {});
        expect(result).to.deep.equal({
            data: {
                user: {
                    username: 'david001',
                    facebookID: 1,
                    name: 'David',
                    description: "robot model #1",
                    followers: [],
                    following: []
                }
            }
        });
       
    });

    it('Query: Should return a list of users', async () => {
        const query = `
        { 
            users(ids: [1,2,3]) { 
                username
            }
        }`;
        const result = await graphql(schema, query, {});
        expect(result).to.deep.equal({
            data: {
                users: [{
                    username: 'david001'
                }, {
                    username: 'walter001'
                }, {
                    username: 'liz'
                }]
            }
        });

    });

    it('Mutation: Should let you update user details', async () => {
        const query = `
        mutation { 
            userUpdateDetails(userId: 1, name:"FakeRipley", desc:"whatever", username:"ripleyclone22") { 
                username
                facebookID,
                name,
                description
            }
        }`;
        const result = await graphql(schema, query, {});
        expect(result).to.deep.equal({
            data: {
                userUpdateDetails: {
                    username: 'ripleyclone22',
                    facebookID: 1,
                    name: 'FakeRipley',
                    description: 'whatever'
                }
            }
        });
       
    });    

    it('Mutation: Should let you follow/unfollow a user', async () => {
        async function followUser() {
            const query = `
            mutation { 
                userFollow(userId: 3, followingId:1, type:"follow") { 
                    username
                    following
                    followers
                }
            }`;
            const result = await graphql(schema, query, {});
            expect(result).to.deep.equal({
                data: {
                    userFollow: {
                        username: 'liz',
                        following: [1],
                        followers: []
                    }
                }
            });
        }

        async function checkFollowedUser(){
            const query2 = `
            { 
                user(id: 1) { 
                    username
                    following
                    followers
                }
            }`;
        
            const result2 = await graphql(schema, query2, {});
            expect(result2).to.deep.equal({
                data: {
                    user: {
                        username: 'david001',
                        following: [],
                        followers: [3]
                    }
                }
            });
        }

        async function unFollowUser() {
            const query = `
            mutation { 
                userFollow(userId: 3, followingId:1, type:"unfollow") { 
                    username
                    following
                    followers
                }
            }`;
            const result = await graphql(schema, query, {});
            expect(result).to.deep.equal({
                data: {
                    userFollow: {
                        username: 'liz',
                        following: [],
                        followers: []
                    }
                }
            });
        }

      async function checkUnFollowedUser(){
            const query2 = `
            { 
                user(id: 1) { 
                    username
                    following
                    followers
                }
            }`;
        
            const result2 = await graphql(schema, query2, {});
            expect(result2).to.deep.equal({
                data: {
                    user: {
                        username: 'david001',
                        following: [],
                        followers: []
                    }
                }
            });
        }

        await followUser();
        await checkFollowedUser();
        await unFollowUser();
        await checkUnFollowedUser();
    });

});