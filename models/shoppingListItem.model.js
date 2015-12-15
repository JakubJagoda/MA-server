export default function (sequelize, DataTypes) {
    const ShoppingListItem = sequelize.define('ShoppingListItem', {
        //needed to perform upsert
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            unique: true,
            allowNull: false,
            autoIncrement: true
        },
        name: DataTypes.STRING,
        amount: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    });

    return ShoppingListItem;
};
