const { sequelize: { models } } = require('../models/index.js');
const { GraphQLObjectType, GraphQLNonNull, GraphQLInt, GraphQLString, GraphQLList } = require('graphql');
const { resolver } = require('graphql-sequelize');

const UserSmall = new GraphQLObjectType({
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

const StoryFragments = new GraphQLObjectType({
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
            type: new GraphQLList(UserSmall),
            resolve: resolver(models.users)
        }
    }
});

const Comments = new GraphQLObjectType({
    name: 'Comments',
    description: 'Comments details',
    fields: {
        id: {
            type: new GraphQLNonNull(GraphQLInt),
        },
        storyId: {
            type: new GraphQLNonNull(GraphQLInt),
        },        
        userid: {
            type: new GraphQLNonNull(GraphQLInt),    
        },
        date: {
            type: GraphQLString,
        },
        comment: {
            type: GraphQLString,
        }
    }
});

const Stories = new GraphQLObjectType({
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
            type: new GraphQLList(UserSmall),
            resolve: resolver(models.users)
        },
        userId: {
            type: new GraphQLNonNull(GraphQLInt),
        },
        storyfragments: {
            type: new GraphQLList(StoryFragments),
            resolve: resolver(models.stories.StoryFragments)
        },
        comments: {
            type: new GraphQLList(Comments),
            resolve: resolver(models.stories.Comments)
        }
    }
});


const User = new GraphQLObjectType({
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
            type: new GraphQLList(Stories),
            resolve: resolver(models.users.Stories)
        }
    }
});

module.exports = {
    User,
    Stories,
    StoryFragments,
    Comments
}
