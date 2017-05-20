module.exports = function (sequelize, DataTypes) {
    const StoryFragments = sequelize.define('storyfragments', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        date: DataTypes.DATE,
        url: DataTypes.STRING,
        viewedby: DataTypes.ARRAY(DataTypes.INTEGER)
    }, {
        classMethods: {
            associate: function (models) {
                StoryFragments.Stories = StoryFragments.belongsTo(models.stories);
            }
        }
    });

    return StoryFragments;
};