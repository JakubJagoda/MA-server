const bcrypt = require('bcrypt-nodejs');

module.exports = function (sequelize, DataTypes) {
    const User = sequelize.define('User', {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        passwordHash: DataTypes.STRING,
        password: {
            type: DataTypes.VIRTUAL,
            set(newPassword) {
                const hash = bcrypt.hashSync(newPassword, bcrypt.genSaltSync());
                this.setDataValue('passwordHash', hash);
            }
        }
    }, {
        instanceMethods: {
            comparePassword(password) {
                const encryptedPassword = this.getDataValue('passwordHash');
                return bcrypt.compareSync(password, encryptedPassword);
            }
        },
        classMethods: {
            associate: function(models) {
                User.hasMany(models.ShoppingList, {as: 'shoppingLists'});
            }
        }
    });

    return User;
};
