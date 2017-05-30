const { sequelize: { models } } = require('../../models');
const StoryFragmentsType  = require('../type');
const { GraphQLNonNull, GraphQLInt, GraphQLError } = require('graphql');

module.exports = {
    type: StoryFragmentsType,
    description: 'Update views for a storyfragment',
    name: 'storyFragmentView',
    args: {
        storyFragId: {
            description: 'ID of the storyfragment',
            type: new GraphQLNonNull(GraphQLInt)
        },
        viewedBy: {
            description: 'ID of the user thats viewed',
            type: new GraphQLNonNull(GraphQLInt)
        }
    },
    resolve: function(root, {storyFragId, viewedBy}) {
        let storyFragCache;
        const alreadyViewedArray = models.storyfragments
        .findById(storyFragId)
        .then((storyFrag) => {
            storyFragCache = storyFrag;
            return storyFrag.get({
                plain: true
            }).viewedBy;
        }).catch((err) => {
           throw new GraphQLError('story fragment not found');
        });

        return alreadyViewedArray.then((viewedArray) => {
            if (viewedArray.indexOf(viewedBy) === -1) {
                viewedArray.push(viewedBy);
                return models.storyfragments
                .update({
                    viewedBy: viewedArray
                }, {
                    where: {
                        id: storyFragId
                    },
                    returning: true,
                    raw: true,
                }).then((result) => {
                    /* could use sequilize resolver here to return a join query, but not sure if its needed yet ? */
                    return result[1][0];
                }).catch((err) => {
                    throw new GraphQLError('error updating viewedBy for story fragment');
                });
            } else {
                return storyFragCache;
            }
        })
    }
};
 