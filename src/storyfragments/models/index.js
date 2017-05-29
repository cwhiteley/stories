module.exports = function (sequelize, DataTypes) {
    const StoryFragments = sequelize.define('storyfragments', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        date: DataTypes.DATEONLY,
        url: DataTypes.STRING,
        viewedBy: {
            type: DataTypes.ARRAY(DataTypes.INTEGER),
            defaultValue: []
        }
    }, {
        classMethods: {
            associate: function (models) {
                StoryFragments.Stories = StoryFragments.belongsTo(models.stories);
            }
        },
        indexes: [
            {
                fields: ['storyId']
            }
        ]        
    });

    return StoryFragments;
};