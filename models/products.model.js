module.exports = function (sequelize, DataTypes) {
    const Product = sequelize.define('Product', {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        classMethods: {
            associate: function(models) {
                Product.belongsToMany(models.ShoppingList, {through: models.ShoppingListItem});
            }
        }
    });

    return Product;
};
