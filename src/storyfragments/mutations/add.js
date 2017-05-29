const { sequelize: { models } } = require('../../models');
const StoryFragmentsType = require('../type');
const { GraphQLNonNull, GraphQLInt, GraphQLString } = require('graphql');


module.exports = {
    type: StoryFragmentsType,
    description: 'Add a story fragment',
    name: 'AddStoryFragment',
    args: {
        userId: {
            description: 'ID of the user',
            type: new GraphQLNonNull(GraphQLInt)
        },
        date: {
            description: 'todays date',
            type: GraphQLString
        },           
        url: {
            description: 'S3 Url for image/video',
            type: GraphQLString
        }
    },
    resolve: function(root, {userId, date, url}) {
        const getStoryId = models.stories
        .findOrCreate({where: {userId: userId, date: date}})
        .spread((story, created) => {
            return story.get({
                plain: true
            }).id;
        });

        return getStoryId.then((storyId) => {
            return models.storyfragments
            .create({
                storyId:storyId,
                date: date,
                url: url
            }).then((storyCreated) => {
                return storyCreated.get({
                    plain: true
                });
            });
        });
    }
};