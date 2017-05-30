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
        name: {
            description: 'Text for the name',
            type: GraphQLString
        },
        desc: {
            description: 'Text for the description',
            type: GraphQLString
        },
        username: {
            description: 'Text for the username',
            type: GraphQLString
        }        
    },
    resolve: function(root, {userId, name, desc, username}) {
        let options = {};
        if (name) {
            options.name = name;
        }

        if (username) {
            options.username = username;
        }

        if (desc) {
            options.description = desc;
        }
        return models.users.update(options, {
            where: {
                id: userId
            },
             returning: true,
             raw: true,
        }).then((result) => {
            if (!result[1].length) {
               throw new GraphQLError("user not found");
            }
            return result[1][0];
        }).catch((err) => {
            throw new GraphQLError(err.message || err.errors || 'error updating user details'); 
        });
    }
};
