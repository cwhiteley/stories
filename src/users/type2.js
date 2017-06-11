const { GraphQLObjectType, GraphQLNonNull, GraphQLInt, GraphQLString } = require('graphql');

module.exports = new GraphQLObjectType({
    name: 'UserSmall',
    description: 'Few User details',
    fields: {
        id: {
            type: new GraphQLNonNull(GraphQLInt)
        },
        facebookID: {
            type: new GraphQLNonNull(GraphQLInt)
        },
        username: {
            type: GraphQLString
        }
    }
});
