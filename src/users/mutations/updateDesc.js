const { sequelize: { models } } = require('../../models');
const UserType = require('../type');
const { GraphQLNonNull, GraphQLInt, GraphQLString } = require('graphql');

module.exports = {
    type: UserType,
    description: 'Update user description',
    name: 'UpdateUserDesc',
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
};
