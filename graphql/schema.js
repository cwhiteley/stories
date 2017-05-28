const { UserQuery, UsersQuery, StoriesQuery, StoryFragmentsQuery, CommentsQuery } = require('./query');
const { GraphQLObjectType, GraphQLSchema } = require('graphql');
const { UpdateUserDesc, AddStoryFragment, UpdateStoryLikes, UpdateStoryFragmentViews, UpdateStoryComments } = require('./mutation');

module.exports = new GraphQLSchema({
    query: new GraphQLObjectType({
        name: 'QuerySchema',
        description: 'APIs exposed as GraphQL',
        fields: {
            user: UserQuery,
            users: UsersQuery,
            stories: StoriesQuery,
            storyfragments: StoryFragmentsQuery,
            comments: CommentsQuery
        }
    }),
    mutation: new GraphQLObjectType({
        name: 'MutationSchema',
        description: 'These are the things we can change',
        fields: {
            updateUserDesc: UpdateUserDesc,
            addStoryFragment: AddStoryFragment,
            updateStoryLikes: UpdateStoryLikes,
            updateStoryFragmentViews: UpdateStoryFragmentViews,
            updateStoryComments: UpdateStoryComments
        }
    })    
})