module.exports = function (sequelize) {
    const ShoppingList = sequelize.define('ShoppingList', {
    }, {
        classMethods: {
            associate: function(models) {
                ShoppingList.belongsToMany(models.Product, {through: models.ShoppingListItem});
            }
        },
        instanceMethods: {
            getAllProducts() {
                const products = this.getDataValue('Products');
                return products.map(product => {
                    return {
                        id: product.id,
                        name: product.name,
                        amount: product.ShoppingListItem.amount
                    };
                });
            }
        }
    });

    return ShoppingList;
};
