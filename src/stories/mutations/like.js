const { sequelize: { models } } = require('../../models');
const StoriesType = require('../type');
const { GraphQLNonNull, GraphQLInt } = require('graphql');

module.exports = {
    type: StoriesType,
    description: 'Update likes for a story',
    name: 'UpdateStoryLikes',
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
    resolve: function(root, {storyId, likedBy}) {
        let storyCache;
        const alreadyLikedArray = models.stories
        .findById(storyId)
        .then((story) => {
            storyCache = story;
            return story.get({
                plain: true
            }).likedby;
        });

        return alreadyLikedArray.then((likedArray) => {
            if (likedArray.indexOf(likedBy) === -1) {
                likedArray.push(likedBy);
                return models.stories
                .update({
                    likedby: likedArray
                }, {
                    where: {
                        id: storyId
                    },
                    returning: true,
                    raw: true,
                }).then((result) => {
                    /* could use sequilize resolver here to return a join query, but not sure if its needed yet ? */
                    return result[1][0];
                });
            } else {
                return storyCache;
            }
        })
    }
};