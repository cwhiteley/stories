const { GraphQLObjectType, GraphQLSchema } = require('graphql');

const user = require('./users/queries/user');
const users = require('./users/queries/users');
const stories = require('./stories/queries/stories');
const storyfragments = require('./storyfragments/queries/storyfragments');
const comments = require('./comments/queries/comments');

const userUpdateDesc = require('./users/mutations/updateDesc');
const userFollow = require('./users/mutations/follow');
const storyFragmentAdd = require('./storyfragments/mutations/add');
const storyFragmentView = require('./storyfragments/mutations/view');
const storyComment = require('./comments/mutations/add');
const storyLike = require('./stories/mutations/like');

module.exports = new GraphQLSchema({
    query: new GraphQLObjectType({
        name: 'QuerySchema',
        fields: {
            user,
            users,
            stories,
            storyfragments,
            comments
        }
    }),
    mutation: new GraphQLObjectType({
        name: 'MutationSchema',
        fields: {
            userUpdateDesc,
            userFollow,
            storyFragmentAdd,
            storyFragmentView,
            storyComment,
            storyLike
        }
    })    
})