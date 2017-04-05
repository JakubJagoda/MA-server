'use strict';

module.exports = {
    up(queryInterface, Sequelize) {
        return queryInterface.addColumn('ShoppingListItems', 'rating', {
            type: Sequelize.INTEGER,
            defaultValue: 0,
            allowNull: false
        });
    },

    down(queryInterface, Sequelize) {
        return queryInterface.removeColumn('ShoppingListItems', 'rating');
    }
};
