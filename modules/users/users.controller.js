import models from './../../models/app.models';
const {User, ShoppingList, Product, ShoppingListItem} = models;
const Promise = require('bluebird');

export function createUser(name, password) {
    return User.findOrCreate({
        where: {name}
    }).spread((user, wasUserCreated) => {
        if (!wasUserCreated) {
            throw new Error('Duplicated name');
        }

        user.set('password', password);
        return user.save();
    }).then(user => user.createShoppingList());
}

export function getUserDetails(userId) {
    return User.find({
        where: {
            id: userId
        },
        attributes: ['id', 'name']
    }).then(user => user.get());
}

export function getUserShoppingLists(userId) {
    return User.find({
        where: {
            id: userId
        },
        include: [{
            model: ShoppingList,
            as: 'shoppingLists',
            attributes: ['id']
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
            attributes: ['id'],
            where: {
                id: shoppingListId
            }
        }]
    }).then(user => {
        return user.get({plain: true}).shoppingLists
    });
}

export function createShoppingListForUser(userId) {
    return User.find({
        where: {
            id: userId
        }
    }).then(user => user.createShoppingList());
}

export function addProductToShoppingList(shoppingListId, productId, amount) {
    return Promise.join(
        ShoppingList.findById(shoppingListId),
        Product.findById(productId),
        (shoppingList, product) => {
            return shoppingList.addProduct(product, {amount});
        }
    );
}

export function updateProduct(shoppingListId, productId, newProduct) {
    return ShoppingListItem.find({
        where: {
            ShoppingListId: shoppingListId,
            ProductId: productId
        }
    }).then(shoppingListItem => shoppingListItem.update(newProduct));
    //ShoppingList.findById(shoppingListId).then(shoppingList => {
    //    return shoppingList.setProduct(product, {amount});
    //});
}


