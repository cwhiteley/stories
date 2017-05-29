const { sequelize: { models } } = require('../models');
const { GraphQLObjectType, GraphQLNonNull, GraphQLInt, GraphQLString } = require('graphql');
const { resolver } = require('graphql-sequelize');

module.exports = new GraphQLObjectType({
    name: 'UserSmall',
    description: 'Few User details',
    fields: {
        id: {
            type: new GraphQLNonNull(GraphQLInt),
        },
        facebookID: {
            type: new GraphQLNonNull(GraphQLInt),
        },
        username: {
            type: GraphQLString,
        }
    }      
});
