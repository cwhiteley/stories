module.exports = function (sequelize, DataTypes) {
    const Comments = sequelize.define('comments', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        userid: {
            type: DataTypes.INTEGER
        },
        date: DataTypes.DATE,
        comment: DataTypes.TEXT
    }, {
        classMethods: {
            associate: function (models) {
                Comments.Story = Comments.belongsTo(models.story);
            }
        }
    });

    return Comments;
};