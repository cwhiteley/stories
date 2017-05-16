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
                Story.belongsTo(models.User);
                Story.hasMany(models.Stories);
                Story.hasMany(models.Comments);
            }
        }
    });

    return Story;
};