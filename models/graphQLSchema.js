const db = require('./index.js');
const { GraphQLObjectType, GraphQLNonNull, GraphQLInt, GraphQLString } = require('graphql');

const StoriesViewedBy = new GraphQLObjectType({
    name: 'Stories ViewedBy',
    description: 'IDs of users that viewed this stories fragment',
    fields: {
        id: {
            type: GraphQLInt,
            description: 'The IDs of users that have viewed the stories fragment'
        }
    }
});

const Stories = new GraphQLObjectType({
    name: 'Stories',
    description: 'Stories details',
    fields: {
        id: {
            type: new GraphQLNonNull(GraphQLInt),
            description: 'The ID of the stories fragment'
        },
        date: {
            type: GraphQLString,
            description: 'The date of the stories fragment'
        },
        url: {
            type: GraphQLString,
            description: 'The url of the stories fragment'
        },
        viewedby: {
            type: new GraphQLList(StoriesViewedBy),
            description: 'The IDs of users that have viewed the stories fragment '
        }
    }
});

const Comments = new GraphQLObjectType({
    name: 'Comments',
    description: 'Comments details',
    fields: {
        id: {
            type: new GraphQLNonNull(GraphQLInt),
            description: 'The ID of the comment'
        },
        userid: {
            type: new GraphQLList(StoryLikedBy),
            description: 'ID of user that has comments on this story'            
        },
        date: {
            type: GraphQLString,
            description: 'The date of the comment'
        },
        comment: {
            type: GraphQLString,
            description: 'The comment'
        }
    }
});

const StoryLikedBy = new GraphQLObjectType({
    name: 'Story Likers',
    description: 'IDs of users that like this story',
    fields: {
        id: {
            type: GraphQLInt,
            description: 'The IDs of users that follow this user'
        }
    }
});

const Story = new GraphQLObjectType({
    name: 'Story',
    description: 'Story details',
    fields: {
        id: {
            type: new GraphQLNonNull(GraphQLInt),
            description: 'The ID of the story'
        },
        date: {
            type: GraphQLString,
            description: 'The date of the story'
        },
        likedby: {
            type: new GraphQLList(StoryLikedBy),
            description: 'IDs of users that like this story'
        },
        stories: {
            type: new GraphQLList(Stories),
            description: 'The Stories fragments for this parent story'
        },
        comments: {
            type: new GraphQLList(Comments),
            description: 'Comments for this parent story'
        }
    }
});


const UserFollowers = new GraphQLObjectType({
    name: 'User Followers',
    description: 'IDs of users that follow this user',
    fields: {
        id: {
            type: GraphQLInt,
            description: 'The IDs of users that follow this user'
        }
    }
});

const User = new GraphQLObjectType({
    name: 'User',
    description: 'User details',
    fields: {
        id: {
            type: new GraphQLNonNull(GraphQLInt),
            description: 'The ID of the user'
        },
        facebookID: {
            type: new GraphQLNonNull(GraphQLInt),
            description: 'The FacebookID of the user'
        },
        name: {
            type: GraphQLString,
            description: 'The name of the user'
        },
        username: {
            type: GraphQLString,
            description: 'The username of the user'
        },
        description: {
            type: GraphQLString,
            description: 'The description of the user'
        },
        followers: {
            type: new GraphQLList(UserFollowers),
            description: 'Array of IDs that follow this user'
        },
        story: {
            type: new GraphQLList(Story),
            description: 'List of Story entities for this user'
        }
    }
});