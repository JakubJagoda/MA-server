module.exports = function (sequelize) {
    const ShoppingList = sequelize.define('ShoppingList', {
    }, {
        classMethods: {
            associate: function(models) {
                ShoppingList.belongsToMany(models.Product, {through: models.ShoppingListItem});
            }
        }
    });

    return ShoppingList;
};
