module.exports = function (sequelize, DataTypes) {
    const Story = sequelize.define('story', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        date: DataTypes.DATE,
        likedby: {
            type: DataTypes.ARRAY(DataTypes.INTEGER)
        }
    }, {
        freezeTableName: true
    }, {
        classMethods: {
            associate: function (models) {
                Story.Users = Story.belongsTo(models.users);
                Story.Stories = Story.hasMany(models.stories);
                Story.Comments = Story.hasMany(models.comments);
            }
        }
    });

    return Story;
};