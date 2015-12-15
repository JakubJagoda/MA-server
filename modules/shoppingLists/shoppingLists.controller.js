import models from './../../models/app.models';
const {User, ShoppingList, ShoppingListItem} = models;
const Promise = require('bluebird');

export function getUserShoppingLists(userId) {
    return User.find({
        where: {
            id: userId
        },
        include: [{
            model: ShoppingList,
            as: 'shoppingLists',
            attributes: ['id', 'name']
        }]
    }).then(user => {
        return user.get({plain: true}).shoppingLists;
    });
}

export function getUserShoppingList(userId, shoppingListId) {
    return User.find({
        where: {
            id: userId
        },
        include: [{
            model: ShoppingList,
            as: 'shoppingLists',
            attributes: ['id', 'name'],
            where: {
                id: shoppingListId
            },
            include: [{
                model: ShoppingListItem,
                as: 'shoppingListItems',
                attributes: ['id', 'name', 'amount']
            }]
        }]
    }).then(user => {
        return user.shoppingLists[0];
    });
}

export function createShoppingListForUser(userId) {
    return User.find({
        where: {
            id: userId
        }
    }).then(user => user.createShoppingList());
}

export function addItemToShoppingList(shoppingListId, name, amount) {
    return Promise.join(
        ShoppingList.findById(shoppingListId),
        ShoppingListItem.create({
            name,
            amount
        }),
        (shoppingList, item) => {
            return shoppingList.addShoppingListItem(item)
                .then(() => item);
        }
    );
}

export function updateItem(shoppingListId, itemId, newItem) {
    return ShoppingListItem.find({
        where: {
            id: itemId,
            ShoppingListId: shoppingListId
        }
    }).then(shoppingListItem => shoppingListItem.update(newItem));
}

export function getItem(shoppingListId, itemId) {
   return ShoppingListItem.find({
       where: {
           id: itemId,
           ShoppingListId: shoppingListId
       },
       attributes: ['name', 'amount']
   }).then(shoppingListItem => shoppingListItem.get({plain: true}));
}

export function deleteItem(shoppingListId, itemId) {
    return ShoppingListItem.destroy({
        where: {
            id: itemId,
            ShoppingListId: shoppingListId
        }
    });
}

export function overwriteList(shoppingListId, items) {
    return Promise.all(items.map(item => {
        return ShoppingListItem.upsert({
            id: item.id,
            ShoppingListId: shoppingListId,
            name: item.name,
            amount: item.amount
        });
    }));
}
