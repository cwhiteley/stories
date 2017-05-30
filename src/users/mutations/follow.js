const { sequelize: { models } } = require('../../models');
const UserType = require('../type');
const { GraphQLNonNull, GraphQLInt, GraphQLString, GraphQLError } = require('graphql');

module.exports = {
    type: UserType,
    description: 'Follow a User',
    name: 'userFollow',
    args: {
        userId: {
            description: 'ID of the user',
            type: new GraphQLNonNull(GraphQLInt)
        },
        followingId: {
            description: 'Text for the description',
            type: new GraphQLNonNull(GraphQLInt)
        },
        type: {
            description: 'follow or unfollow',
            type: new GraphQLNonNull(GraphQLString)
        }        
    },
    resolve: function(root, {userId, followingId, type}) {
        //update following column for user
        let usersCache;
        const alreadyFollowingArray = models.users
        .findById(userId)
        .then((resultUser) => {
            usersCache = resultUser;
            return resultUser.get({
                plain: true
            }).following;
        }).catch((err) => {
            throw new GraphQLError('user not found');
        });    

        return alreadyFollowingArray.then((followingArray) => {
            if (followingArray.indexOf(followingId) > -1 && type === 'follow') {
                return Promise.resolve(usersCache);
            }

            if (followingArray.indexOf(followingId) === -1 && type === 'unfollow') {
                return Promise.resolve(usersCache);
            }            
            
            return models.users
            .update({
                following: updateArray(type, followingArray, followingId)
            }, {
                where: {
                    id: userId
                },
                returning: true,
                raw: true,
            }).then((result) => {
                return updateFollowers().then(() => {
                    return result[1][0];
                });
            }).catch((err) => {
                throw new GraphQLError(err.message || err.errors || 'error updating follower/following array for user');
            });
        });


        //update followers column for followingId
        function updateFollowers() {
            const alreadyFollowersArray = models.users
            .findById(followingId)
            .then((resultUser) => {
                return resultUser.get({
                    plain: true
                }).followers;
            });

            return alreadyFollowersArray.then((followersArray) => {
                if (followersArray.indexOf(userId) > -1 && type === 'follow') {
                    return Promise.resolve();
                }

                if (followersArray.indexOf(userId) === -1 && type === 'unfollow') {
                    return Promise.resolve();
                }                
                
                return models.users
                .update({
                    followers: updateArray(type, followersArray, userId)
                }, {
                    where: {
                        id: followingId
                    },
                    returning: true,
                    raw: true,
                });
      
            });
        }
    }
};

function updateArray(type, arr, val) {
    if (type === 'follow') {
        return arr.concat(val); 
    }

    if (type === 'unfollow') {
         return arr.filter((item) => {
	        return item !== val;
        });
    } 
}