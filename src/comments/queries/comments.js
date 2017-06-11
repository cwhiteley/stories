const { sequelize: { models } } = require('../../models');
const CommentsType = require('../type');
const { GraphQLNonNull, GraphQLInt, GraphQLList } = require('graphql');
const { resolver } = require('graphql-sequelize');

module.exports = {
    type: new GraphQLList(CommentsType),
    name: 'comments',
    args: {
        storyId: {
            description: 'ID of the story',
            type: new GraphQLNonNull(GraphQLInt)
        }
    },
    resolve: resolver(models.comments)
};
