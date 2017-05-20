const { sequelize: { models } } = require('./index.js');
const { GraphQLObjectType, GraphQLNonNull, GraphQLInt, GraphQLString, GraphQLList, GraphQLSchema } = require('graphql');
const { resolver } = require('graphql-sequelize');


const StoryFragments = new GraphQLObjectType({
    name: 'StoryFragments',
    description: 'StoryFragments details',
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
            type: new GraphQLList(GraphQLInt),
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
            type: new GraphQLList(GraphQLInt),
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
        story: {
            type: new GraphQLList(Stories),
            resolve: resolver(models.users.Stories)
        }
    }
});

/****** QUERIES  */
 const UserQuery = {
     type: User,
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
     type: new GraphQLList(User),
     name: 'Users',
     args: {
         id: {
             description: 'ID of the user',
             type: new GraphQLList(GraphQLInt)
         }
     },
     resolve: resolver(models.users)
 }


  const StoriesQuery = {
     type: new GraphQLList(Stories),
     name: 'Stories',
     args: {
         userId: {
             description: 'ID of the story',
             type: new GraphQLNonNull(GraphQLInt)
         }
     },
     resolve: resolver(models.stories)
 }
/****** QUERIES  */


const Schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Schema',
    description: 'APIs exposed as GraphQL',
    fields: {
      user: UserQuery,
      users: UsersQuery,
      stories: StoriesQuery
    }
  })
});

module.exports.schema = Schema;