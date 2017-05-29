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
            defaultValue: []
        },
        following: {
            type: DataTypes.ARRAY(DataTypes.INTEGER),
            defaultValue: []
        }        
    }, {
        classMethods: {
            associate: function (models) {
                Users.Stories = Users.hasMany(models.stories);
                Users.Comments = Users.hasMany(models.comments);
            }
        },
        indexes: [
            {
                unique: true,
                fields: ['id'] //maybe facebookID is better?
            }
        ]        
    });

    return Users;
};