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
            attributes: ['id', 'name'],
            where: {
                ShoppingListId: null
            }
        }]
    }).then(user => {
        return user.get({plain: true}).shoppingLists;
    });
}

export function getUserShoppingList(userId, shoppingListId, shoppingListItemAttributes) {
    return User.find({
        where: {
            id: userId
        },
        include: [{
            model: ShoppingList,
            as: 'shoppingLists',
            attributes: ['id', 'name', 'ShoppingListId'],
            where: {
                id: shoppingListId
            },
            include: [{
                model: ShoppingListItem,
                as: 'shoppingListItems',
                attributes: shoppingListItemAttributes
            }]
        }]
    }).then(user => {
        return user.shoppingLists[0];
    });
}

export function createShoppingListForUser(userId, shoppingListName, parentShoppingListId = null) {
    return User.find({
        where: {
            id: userId
        }
    }).then(user => user.createShoppingList({
        name: shoppingListName
    })).then(newShoppingList => {
        if (!parentShoppingListId) {
            return newShoppingList;
        }

        return ShoppingList.find({
            where: {
                id: parentShoppingListId
            }
        }).then(parentShoppingList => {
            newShoppingList.set('ShoppingListId', parentShoppingList.get('id'));
            return newShoppingList.save();
        });
    });
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

export function getItem(shoppingListId, itemId, attributes) {
   return ShoppingListItem.find({
       where: {
           id: itemId,
           ShoppingListId: shoppingListId
       },
       attributes
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
            amount: item.amount,
            rating: item.rating || 0
        });
    }));
}

export function getNestedListsForList(shoppingListId) {
    return ShoppingList.findAll({
        where: {
            ShoppingListId: shoppingListId
        },
        attributes: ['id', 'name']
    }).then(nestedLists => {
        return nestedLists.map(nestedList => nestedList.get({plain: true}));
    });
}
