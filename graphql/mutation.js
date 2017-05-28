const { sequelize: { models } } = require('../models/index.js');
const { UserType, StoriesType, StoryFragmentsType, CommentsType } = require('./types');
const { GraphQLObjectType, GraphQLNonNull, GraphQLInt, GraphQLString, GraphQLList, GraphQLSchema } = require('graphql');

//registration happens outside of grahql
//add + update story/stories
//add story [press upload add to stories for current story, story is based on ]
//pass todays date, check if there is story for this date? return story id
//other wise create a story and return the id
//create stories 

//do customh join to show whos viewed and liked



//update story - likes - x
//update story - comments - x
//update storyfragment - viewed - x
//update users, follow
//update users - desc?

const UpdateUserDesc = {
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

const AddStoryFragment =  {
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

const UpdateStoryLikes = {
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


const UpdateStoryFragmentViews = {
    type: StoryFragmentsType,
    description: 'Update views for a storyfragment',
    name: 'UpdateStoryFragmentViews',
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
            }).viewedby;
        });

        return alreadyViewedArray.then((viewedArray) => {
            if (viewedArray.indexOf(viewedBy) === -1) {
                viewedArray.push(viewedBy);
                return models.storyfragments
                .update({
                    viewedby: viewedArray
                }, {
                    where: {
                        id: storyFragId
                    },
                    returning: true,
                    raw: true,
                }).then((result) => {
                    /* could use sequilize resolver here to return a join query, but not sure if its needed yet ? */
                    return result[1][0];
                });
            } else {
                return storyFragCache;
            }
        })
    }
};
 

const UpdateStoryComments = {
    type: CommentsType,
    description: 'Update story comments',
    name: 'UpdateStoryComments',
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
    resolve: function(root, {storyId, userId, comment}) {
        return models.comments.create({
             storyId: storyId,
             userId: userId,
             comment: comment
        }).then((result) => {
          return result.get({
                plain: true
            });
        });
    }
};

module.exports = {
    UpdateUserDesc,
    AddStoryFragment,
    UpdateStoryLikes,
    UpdateStoryFragmentViews,
    UpdateStoryComments
};

/*
mutation {
    addStoryFragment(userId: 1, date:"2017-05-28", url:"new.jpg") {
		id,
    viewedby
    }
  }


query {
  stories(userId: 1) {
    id,
    storyfragments {
      date,
      url
    }
  } 
}*/