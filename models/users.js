module.exports = function (sequelize, DataTypes) {
    const Users = sequelize.define('users', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        facebookID: DataTypes.STRING,
        name: DataTypes.STRING,
        username: DataTypes.STRING,
        description: DataTypes.STRING,
        followers: {
            type: DataTypes.ARRAY(DataTypes.INTEGER),
            allowNull: true
        }
    }, {
        classMethods: {
            associate: function (models) {
                Users.hasMany(models.Story);
            }
        }
    });

    return Users;
};