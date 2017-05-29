const { sequelize: { models } } = require('../models');
const { GraphQLObjectType, GraphQLNonNull, GraphQLInt, GraphQLString, GraphQLList } = require('graphql');
const { resolver } = require('graphql-sequelize');

module.exports = new GraphQLObjectType({
    name: 'StoryFragments',
    description: 'StoryFragments details',
    fields: {
        id: {
            type: new GraphQLNonNull(GraphQLInt),
        },
        storyId: {
            type: new GraphQLNonNull(GraphQLInt),
        },        
        date: {
            type: GraphQLString,
        },
        url: {
            type: GraphQLString,
        },
        viewedBy: {
            type: new GraphQLList(GraphQLInt),
        }
    }
});