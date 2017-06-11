const { sequelize: { models } } = require('../../models');
const StoriesType = require('../type');
const { GraphQLNonNull, GraphQLInt, GraphQLError } = require('graphql');

module.exports = {
    type: StoriesType,
    description: 'storyLike',
    name: 'storyLike',
    args: {
        storyId: {
            description: 'ID of the story',
            type: new GraphQLNonNull(GraphQLInt)
        },
        likedBy: {
            description: 'ID of the user thats liking',
            type: new GraphQLNonNull(GraphQLInt)
        }
    },
    resolve(root, { storyId, likedBy }) {
        let storyCache;
        const alreadyLikedArray = models.stories
        .findById(storyId)
        .then((story) => {
            storyCache = story;
            return story.get({
                plain: true
            }).likedBy;
        }).catch((err) => {
            throw new GraphQLError(err.errors[0].message || err.message || 'error finding user');
        });

        return alreadyLikedArray.then((likedArray) => {
            if (likedArray.indexOf(likedBy) === -1) {
                likedArray.push(likedBy);
                return models.stories
                .update({
                    likedBy: likedArray
                }, {
                    where: {
                        id: storyId
                    },
                    returning: true,
                    raw: true,
                }).then((result) => {
                    /* could use sequilize resolver here to return a join query, but not sure if
                    its needed yet ? */
                    return result[1][0];
                }).catch((err) => {
                    throw new GraphQLError(err.errors[0].message || err.message || 'error updating likedby array for story');
                });
            }
            return storyCache;
        });
    }
};
