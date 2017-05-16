module.exports = function (sequelize, DataTypes) {
    const Comments = sequelize.define('comments', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        date: DataTypes.DATE,
        comment: DataTypes.TEXT
    }, {
        classMethods: {
            associate: function (models) {
                Comments.belongsTo(models.Story);
            }
        }
    });

    return Comments;
};