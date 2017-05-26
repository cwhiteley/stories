const { sequelize: { models } } = require('../models/index.js');
const { UserType, StoriesType, StoryFragmentsType, CommentsType } = require('./types');
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
/* function(root, args) {
       return models.stories.findAll({
        where: {
            userId: args.userId,
            date: {
                $lt: new Date()
            }
        }
    })}*/
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

module.exports = {
    UserQuery,
    UsersQuery,
    StoriesQuery,
    StoryFragmentsQuery
};

/*
{
  user(id: 3) {
    name,
    following
  }
  users(id: [1, 2]) {
    name,
    description
  }
   stories(userId: 1) {
    id,
    date,
    userId,
    likedby {
      username
    }
  } 
  storyfragments(storyId: 1) {
    id,
    viewedby {
      username
    }
  }
}
*/