const { sequelize: { models } } = require('../models/index.js');
const { UserType, StoriesType, StoryFragmentsType, CommentsType } = require('./types');
const { GraphQLObjectType, GraphQLNonNull, GraphQLInt, GraphQLString, GraphQLList, GraphQLSchema } = require('graphql');

//registration happens outside of grahql

//add story [press upload add to stories for current story, story is based on ]
//pass todays date, check if there is story for this date? return story id
//other wise create a story and return the id
//create stories 

//do customh join to show whos viewed and liked

//add stories
//update story - likes
//update story - comments
//update stories - viewed
//update users, follow
//update users - desc?

const UserMutation = {
    type: UserType,
    description: 'Update user description',
    name: 'UserMutation',
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
        userid: {
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
    resolve: function(root, {userid, date, url}) {
        const getStoryId = models.stories
        .findOrCreate({where: {userId: userid, date: date}})
        .spread((user, created) => {
            return user.get({
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
 

module.exports = {
    UserMutation,
    AddStoryFragment
};

