const { sequelize: { models } } = require('./index.js');
const { GraphQLObjectType, GraphQLNonNull, GraphQLInt, GraphQLString, GraphQLList, GraphQLSchema } = require('graphql');
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

/* for a bunch of userID's give me a bunch of stories */


/* FOR USER PROFILE PAGE, for user 1, give me all his stories */
  const StoriesQuery = {
     type: new GraphQLList(Stories),
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

 /*
  function(root, args) {
        return models.stories.findAll({
         where: {
             userId: args.userId,
             date: {
                 $lt: new Date()
             }
         }
     })}
     */

/* when you click on a story, give me all its pieces */
  const StoryFragmentsQuery = {
     type: new GraphQLList(StoryFragments),
     name: 'StoryFragments',
     args: {
         storyId: {
             description: 'ID of the story',
             type: new GraphQLNonNull(GraphQLInt)
         }
     },
     resolve: resolver(models.storyfragments)
 } 
/****** QUERIES  */


const Schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Schema',
    description: 'APIs exposed as GraphQL',
    fields: {
      user: UserQuery,
      users: UsersQuery,
      stories: StoriesQuery,
      storyfragments: StoryFragmentsQuery
    }
  })
});

module.exports.schema = Schema;

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