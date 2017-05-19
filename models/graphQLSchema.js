const { sequelize: { models } } = require('./index.js');
const { GraphQLObjectType, GraphQLNonNull, GraphQLInt, GraphQLString, GraphQLList, GraphQLSchema } = require('graphql');
const { resolver } = require('graphql-sequelize');

const StoriesViewedBy = new GraphQLObjectType({
    name: 'StoriesViewedBy',
    description: 'IDs of users that viewed this stories fragment',
    fields: {
        id: {
            type: GraphQLInt,
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
        url: {
            type: GraphQLString,
        },
        viewedby: {
            type: new GraphQLList(StoriesViewedBy),
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

const StoryLikedBy = new GraphQLObjectType({
    name: 'StoryLikedBy',
    description: 'IDs of users that like this story',
    fields: {
        id: {
            type: GraphQLInt,
        }
    }
});

const Story = new GraphQLObjectType({
    name: 'Story',
    description: 'Story details',
    fields: {
        id: {
            type: new GraphQLNonNull(GraphQLInt),
        },
        date: {
            type: GraphQLString,
        },
        likedby: {
            type: new GraphQLList(StoryLikedBy),
        },
        stories: {
            type: new GraphQLList(Stories),
            resolve: resolver(models.story.Stories)
        },
        comments: {
            type: new GraphQLList(Comments),
            resolve: resolver(models.story.Comments)
        }
    }
});


const UserFollowers = new GraphQLObjectType({
    name: 'UserFollowers',
    description: 'IDs of users that follow this user',
    fields: {
        id: {
            type: GraphQLInt,
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
            type: new GraphQLList(UserFollowers),
        },
        story: {
            type: new GraphQLList(Story),
            resolve: resolver(models.users.Story)
        }
    }
});


// const Schema = new GraphQLSchema({
//   query: new GraphQLObjectType({
//     name: 'This is root query',
//     fields: {
//       user: {
//         type: new GraphQLList(User),
//         args: {
//           id: {
//             description: 'id of the user',
//             type: new GraphQLNonNull(GraphQLInt)
//           }
//         },
//         resolve: resolver(User)
//       }
//     }
//   })
// });