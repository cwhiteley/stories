const { sequelize: { models } } = require('../../models');
const StoryFragmentsType = require('../type');
const { GraphQLNonNull, GraphQLInt, GraphQLList } = require('graphql');
const { resolver } = require('graphql-sequelize');

module.exports = {
    type: new GraphQLList(StoryFragmentsType),
    name: 'storyFragments',
    args: {
        storyId: {
            description: 'ID of the story',
            type: new GraphQLNonNull(GraphQLInt)
        }
    },
    resolve: resolver(models.storyfragments)
};
