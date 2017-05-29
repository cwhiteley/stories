const { sequelize: { models } } = require('../../models');
const StoriesType = require('../type');
const { GraphQLNonNull, GraphQLInt, GraphQLString, GraphQLList } = require('graphql');
const { resolver } = require('graphql-sequelize');

module.exports = {
    type: new GraphQLList(StoriesType),
    name: 'Stories',
    args: {
        userId: {
            description: 'IDs of the user',
            type: new GraphQLList(GraphQLInt)
        },
        limit: {
            type: GraphQLInt
        },
        order: {
            type: GraphQLString
        }
    },
    resolve: resolver(models.stories)
}