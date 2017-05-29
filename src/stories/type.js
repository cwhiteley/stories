const { sequelize: { models } } = require('../models');
const { GraphQLObjectType, GraphQLNonNull, GraphQLInt, GraphQLString, GraphQLList } = require('graphql');
const { resolver } = require('graphql-sequelize');
const StoryFragmentsType = require('../storyfragments/type');
const CommentsType = require('../comments/type');

module.exports = new GraphQLObjectType({
    name: 'Stories',
    description: 'Stories details',
    fields: {
        id: {
            type: new GraphQLNonNull(GraphQLInt),
        },
        date: {
            type: GraphQLString,
        },
        likedBy: {
            type: new GraphQLList(GraphQLInt)
        },
        userId: {
            type: new GraphQLNonNull(GraphQLInt),
        },
        storyfragments: {
            type: new GraphQLList(StoryFragmentsType),
            resolve: resolver(models.stories.StoryFragments)
        },
        comments: {
            type: new GraphQLList(CommentsType),
            resolve: resolver(models.stories.Comments)
        }
    }
});