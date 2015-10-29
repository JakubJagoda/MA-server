module.exports = function (sequelize, DataTypes) {
    const ShoppingListItem = sequelize.define('ShoppingListItem', {
        amount: DataTypes.INTEGER
    });

    return ShoppingListItem;
};
