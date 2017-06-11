const { sequelize: { models } } = require('../../models');
const UserType = require('../type');
const { GraphQLList, GraphQLInt } = require('graphql');
const { resolver } = require('graphql-sequelize');

module.exports = {
    type: new GraphQLList(UserType),
    name: 'users',
    args: {
        ids: {
            description: 'ID of the user',
            type: new GraphQLList(GraphQLInt)
        }
    },
    resolve: resolver(models.users)
};
