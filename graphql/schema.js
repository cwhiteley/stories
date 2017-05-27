const { UserQuery, UsersQuery, StoriesQuery, StoryFragmentsQuery } = require('./query');
const { GraphQLObjectType, GraphQLSchema } = require('graphql');
const { UserMutation, AddStoryFragment } = require('./mutation');

module.exports = new GraphQLSchema({
    query: new GraphQLObjectType({
        name: 'Schema',
        description: 'APIs exposed as GraphQL',
        fields: {
            user: UserQuery,
            users: UsersQuery,
            stories: StoriesQuery,
            storyfragments: StoryFragmentsQuery
        }
    }),
    mutation: new GraphQLObjectType({
        name: 'Schema2',
        description: 'These are the things we can change',
        fields: {
            updateUserDesc: UserMutation,
            addStoryFragment: AddStoryFragment
        }
    })    
});