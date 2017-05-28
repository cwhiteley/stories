const { sequelize: { models } } = require('../models/index.js');
const { UserType, UserSmallType, StoriesType, StoryFragmentsType, CommentsType } = require('./types');
const { GraphQLObjectType, GraphQLNonNull, GraphQLInt, GraphQLString, GraphQLList, GraphQLSchema } = require('graphql');
const { resolver } = require('graphql-sequelize');

const UserQuery = {
    type: UserType,
    name: 'User',
    args: {
        id: {
            description: 'ID of the user',
            type: new GraphQLNonNull(GraphQLInt)
        }
    },
    resolve: resolver(models.users)
}

const UsersQuery = {
    type: new GraphQLList(UserType),
    name: 'Users',
    args: {
        id: {
            description: 'ID of the user',
            type: new GraphQLList(GraphQLInt)
        }
    },
    resolve: resolver(models.users)
}

/* for a bunch of userID's give me a bunch of stories */
/* FOR USER PROFILE PAGE, for user 1, give me all his stories */
const StoriesQuery = {
    type: new GraphQLList(StoriesType),
    name: 'Stories',
    args: {
        userId: {
            description: 'IDs of the user',
            type: new GraphQLList(GraphQLInt)
        },
        limit: {
            type: GraphQLInt
        },
        order: {
            type: GraphQLString
        }
    },
    resolve: resolver(models.stories)
}

/* when you click on a story, give me all its pieces */
const StoryFragmentsQuery = {
    type: new GraphQLList(StoryFragmentsType),
    name: 'StoryFragments',
    args: {
        storyId: {
            description: 'ID of the story',
            type: new GraphQLNonNull(GraphQLInt)
        }
    },
    resolve: resolver(models.storyfragments)
}

const CommentsQuery = {
    type: new GraphQLList(CommentsType),
    name: 'CommentsType',
    args: {
        storyId: {
            description: 'ID of the story',
            type: new GraphQLNonNull(GraphQLInt)
        }
    },
    resolve: resolver(models.comments)
}

module.exports = {
    UserQuery,
    UsersQuery,
    StoriesQuery,
    StoryFragmentsQuery,
    CommentsQuery
};

