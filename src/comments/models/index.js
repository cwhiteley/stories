module.exports = function (sequelize, DataTypes) {
    const Comments = sequelize.define('comments', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        comment: DataTypes.TEXT
    }, {
        classMethods: {
            associate: function (models) {
                Comments.Stories = Comments.belongsTo(models.stories);
                Comments.Users = Comments.belongsTo(models.users);
            }
        },
        indexes: [
            {
                fields: ['storyId']
            }
        ]  
    });

    return Comments;
};