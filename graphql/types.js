const { sequelize: { models } } = require('../models/index.js');
const { GraphQLObjectType, GraphQLNonNull, GraphQLInt, GraphQLString, GraphQLList } = require('graphql');
const { resolver } = require('graphql-sequelize');

/** might not need this because fetching user also fetches stories */
const UserSmallType = new GraphQLObjectType({
    name: 'UserSmall',
    description: 'Few User details',
    fields: {
        id: {
            type: new GraphQLNonNull(GraphQLInt),
        },
        facebookID: {
            type: new GraphQLNonNull(GraphQLInt),
        },
        username: {
            type: GraphQLString,
        }
    }      
});

const StoryFragmentsType = new GraphQLObjectType({
    name: 'StoryFragments',
    description: 'StoryFragments details',
    fields: {
        id: {
            type: new GraphQLNonNull(GraphQLInt),
        },
        storyId: {
            type: new GraphQLNonNull(GraphQLInt),
        },        
        date: {
            type: GraphQLString,
        },
        url: {
            type: GraphQLString,
        },
        viewedby: {
            type: new GraphQLList(GraphQLInt),
        }
    }
});

const CommentsType = new GraphQLObjectType({
    name: 'Comments',
    description: 'Comments details',
    fields: {
        id: {
            type: new GraphQLNonNull(GraphQLInt),
        },
        storyId: {
            type: new GraphQLNonNull(GraphQLInt),
        },        
        users: {
            type: UserSmallType,
            resolve: resolver(models.comments.Users)
        },
        comment: {
            type: GraphQLString,
        }
    }
});

const StoriesType = new GraphQLObjectType({
    name: 'Stories',
    description: 'Stories details',
    fields: {
        id: {
            type: new GraphQLNonNull(GraphQLInt),
        },
        date: {
            type: GraphQLString,
        },
        likedby: {
            type: new GraphQLList(GraphQLInt)
        },
        userId: {
            type: new GraphQLNonNull(GraphQLInt),
        },
        storyfragments: {
            type: new GraphQLList(StoryFragmentsType),
            resolve: resolver(models.stories.StoryFragments)
        },
        comments: {
            type: new GraphQLList(CommentsType),
            resolve: resolver(models.stories.Comments)
        }
    }
});


const UserType = new GraphQLObjectType({
    name: 'User',
    description: 'User details',
    fields: {
        id: {
            type: new GraphQLNonNull(GraphQLInt),
        },
        facebookID: {
            type: new GraphQLNonNull(GraphQLInt),
        },
        name: {
            type: GraphQLString,
        },
        username: {
            type: GraphQLString,
        },
        description: {
            type: GraphQLString,
        },
        followers: {
            type: new GraphQLList(GraphQLInt),
        },
        following: {
            type: new GraphQLList(GraphQLInt),
        },        
        story: {
            type: new GraphQLList(StoriesType),
            resolve: resolver(models.users.Stories)
        }
    }
});

module.exports = {
    UserType,
    UserSmallType,
    StoriesType,
    StoryFragmentsType,
    CommentsType
}
