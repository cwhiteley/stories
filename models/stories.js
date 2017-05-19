module.exports = function (sequelize, DataTypes) {
    const Stories = sequelize.define('stories', {
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
                Stories.Story = Stories.belongsTo(models.story);
            }
        }
    });

    return Stories;
};