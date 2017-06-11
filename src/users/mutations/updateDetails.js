const { sequelize: { models } } = require('../../models');
const UserType = require('../type');
const { GraphQLString, GraphQLError } = require('graphql');

module.exports = {
    type: UserType,
    description: 'Update user description',
    name: 'userUpdateDesc',
    args: {
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
    resolve(root, { name, desc, username }, req) {
        if (!req.user) {
            throw new GraphQLError('Invalid JWT Token');
        }
        const userId = req.user.id;
        const options = {};
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
                throw new GraphQLError('user not found');
            }
            return result[1][0];
        }).catch((err) => {
            throw new GraphQLError(err.errors[0].message || err.message || 'error updating user details');
        });
    }
};
