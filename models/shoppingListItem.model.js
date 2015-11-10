module.exports = function (sequelize, DataTypes) {
    const ShoppingListItem = sequelize.define('ShoppingListItem', {
        amount: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    });

    return ShoppingListItem;
};
