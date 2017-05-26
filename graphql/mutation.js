const { sequelize: { models } } = require('../models/index.js');
const { UserType, StoriesType, StoryFragmentsType, CommentsType } = require('./types');
const { GraphQLObjectType, GraphQLNonNull, GraphQLInt, GraphQLString, GraphQLList, GraphQLSchema } = require('graphql');

//registration happens outside of grahql

//add story 
//add stories
//update story - likes
//update story - comments
//update stories - viewed
//update users, follow
//update users - desc?

const UserMutation = {
    type: UserType,
    description: 'Update user description',
    name: 'UserMutation',
    args: {
        id: {
            description: 'ID of the user',
            type: new GraphQLNonNull(GraphQLInt)
        },
        desc: {
            description: 'Text for the description',
            type: GraphQLString
        }
    },
    resolve: function(root, {id, desc}) {
        return models.users.update({
            description: desc
        }, {
            where: {
                id: id
            },
             returning: true,
             raw: true,
        }).then((result) => {
            return result[1][0];
        });
    }
}

module.exports = {
    UserMutation
};