const { sequelize: { models } } = require('../../models');
const UserType = require('../type');
const { GraphQLNonNull, GraphQLInt, GraphQLString, GraphQLError } = require('graphql');

module.exports = {
    type: UserType,
    description: 'Update user description',
    name: 'userUpdateDesc',
    args: {
        userId: {
            description: 'ID of the user',
            type: new GraphQLNonNull(GraphQLInt)
        },
        desc: {
            description: 'Text for the description',
            type: GraphQLString
        }
    },
    resolve: function(root, {userId, desc}) {
        return models.users.update({
            description: desc
        }, {
            where: {
                id: userId
            },
             returning: true,
             raw: true,
        }).then((result) => {
            if (!result[1].length) {
                throw new GraphQLError('user not found');
            }
            return result[1][0];
        }).catch((err) => {
            throw new GraphQLError('error updating user description');
        });
    }
};
