module.exports = function (sequelize, DataTypes) {
    const Stories = sequelize.define('stories', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        date: DataTypes.DATEONLY,
        likedBy: {
            type: DataTypes.ARRAY(DataTypes.INTEGER),
            defaultValue: []
        }
    }, {
        classMethods: {
            associate: function (models) {
                Stories.Users = Stories.belongsTo(models.users);
                Stories.StoryFragments = Stories.hasMany(models.storyfragments);
                Stories.Comments = Stories.hasMany(models.comments);
            }
        },
        indexes: [
            {
                fields: ['userId']
            }
        ]
    });

    return Stories;
};