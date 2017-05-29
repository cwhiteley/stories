const { sequelize: { models } } = require('../../models');
const UserType = require('../type');
const { GraphQLNonNull, GraphQLInt } = require('graphql');
const { resolver } = require('graphql-sequelize');

module.exports = {
    type: UserType,
    name: 'User',
    args: {
        id: {
            description: 'ID of the user',
            type: new GraphQLNonNull(GraphQLInt)
        }
    },
    resolve: resolver(models.users)
}