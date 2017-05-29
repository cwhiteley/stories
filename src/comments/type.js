const { sequelize: { models } } = require('../models');
const { GraphQLObjectType, GraphQLNonNull, GraphQLInt, GraphQLString } = require('graphql');
const { resolver } = require('graphql-sequelize');
const UserSmallType = require('../users/type2');

module.exports = new GraphQLObjectType({
    name: 'Comments',
    description: 'Comments details',
    fields: {
        id: {
            type: new GraphQLNonNull(GraphQLInt),
        },
        storyId: {
            type: new GraphQLNonNull(GraphQLInt),
        },        
        users: {
            type: UserSmallType,
            resolve: resolver(models.comments.Users)
        },
        comment: {
            type: GraphQLString
        }
    }
});