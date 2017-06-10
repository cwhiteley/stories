const { sequelize: { models } } = require('../models');
const { GraphQLObjectType, GraphQLNonNull, GraphQLInt, GraphQLString, GraphQLList } = require('graphql');
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
        userId: {
            type: new GraphQLNonNull(GraphQLInt),
        },         
        user: {     
            type: new GraphQLList(UserSmallType),
            resolve: function(root, args) {
                return models.users.findAll({
                    where: {
                        id: root.userId
                    }
                 });
            }
        },
        comment: {
            type: GraphQLString
        }
    }
});