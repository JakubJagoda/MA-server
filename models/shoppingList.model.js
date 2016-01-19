export default function (sequelize, DataTypes) {
    const ShoppingList = sequelize.define('ShoppingList', {
        name: {
            type: DataTypes.STRING,
            defaultValue: 'Default',
            allowNull: false
        }
    }, {
        classMethods: {
            associate: function (models) {
                ShoppingList.hasMany(models.ShoppingListItem, {as: 'shoppingListItems'});
                ShoppingList.hasOne(ShoppingList, {as: 'ParentShoppingList'});
            }
        }
    });

    return ShoppingList;
};
