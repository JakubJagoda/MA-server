export default function (sequelize, DataTypes) {
    const ShoppingListItem = sequelize.define('ShoppingListItem', {
        name: DataTypes.STRING,
        amount: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    });

    return ShoppingListItem;
};
