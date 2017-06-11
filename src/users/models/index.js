module.exports = function (sequelize, DataTypes) {
    const Users = sequelize.define('users', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        facebookID: DataTypes.STRING,
        name: DataTypes.STRING,
        username: {
            type: DataTypes.STRING,
            unique: true,
            validate: {
                isAlphanumeric: true
            }
        },
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
            associate(models) {
                Users.Stories = Users.hasMany(models.stories);
                Users.Comments = Users.hasMany(models.comments);
            }
        },
        indexes: [
            {
                unique: true,
                fields: ['id', 'username'] // maybe facebookID is better?
            }
        ]
    });

    return Users;
};
