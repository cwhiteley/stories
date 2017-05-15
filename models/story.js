module.exports = function (sequelize, DataTypes) {
    const Story = sequelize.define('story', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        date: DataTypes.DATE,
        likedby: {
            type: DataTypes.ARRAY(Sequelize.DataTypes)
        }
    }, {
        freezeTableName: true
    });

    return Story;
};