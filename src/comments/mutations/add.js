const { sequelize: { models } } = require('../../models');
const CommentsType = require('../type');
const { GraphQLNonNull, GraphQLInt, GraphQLString, GraphQLError } = require('graphql');

module.exports = {
    type: CommentsType,
    description: 'Update story comments',
    name: 'commentAdd',
    args: {
        storyId: {
            description: 'ID of the story',
            type: new GraphQLNonNull(GraphQLInt)
        },
        userId: {
            description: 'ID of the user leaving the comment',
            type: new GraphQLNonNull(GraphQLInt)
        },
        comment: {
            description: 'Text for the comment',
            type: GraphQLString
        }
    },
    resolve(root, { storyId, userId, comment }) {
        return models.comments.create({
            storyId,
            userId,
            comment
        }).then((result) => {
            return result.get({
                plain: true
            });
        }).catch((err) => {
            throw new GraphQLError(err.errors[0].message || err.message || 'error creating comment');
        });
    }
};
