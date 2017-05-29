const { sequelize: { models } } = require('../models');
const { GraphQLObjectType, GraphQLNonNull, GraphQLInt, GraphQLString, GraphQLList } = require('graphql');
const { resolver } = require('graphql-sequelize');
const StoriesType = require('../stories/type');

module.exports = new GraphQLObjectType({
    name: 'User',
    description: 'User details',
    fields: {
        id: {
            type: new GraphQLNonNull(GraphQLInt),
        },
        facebookID: {
            type: new GraphQLNonNull(GraphQLInt),
        },
        name: {
            type: GraphQLString,
        },
        username: {
            type: GraphQLString,
        },
        description: {
            type: GraphQLString,
        },
        followers: {
            type: new GraphQLList(GraphQLInt),
        },
        following: {
            type: new GraphQLList(GraphQLInt),
        },        
        story: {
            type: new GraphQLList(StoriesType),
            resolve: resolver(models.users.Stories)
        }
    }
});
