import models from './../../models/app.models';
const {User, ShoppingList, Product, ShoppingListItem} = models;
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
                model: Product,
                attributes: ['id', 'name']
            }]
        }]
    }).then(user => {
        const shoppingList = user.shoppingLists[0];
        return {
            id: shoppingList.id,
            shoppingListItems: shoppingList.getAllProducts()
        };
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
}

export function getProduct(shoppingListId, productId) {
   return Promise.all([
       ShoppingListItem.find({
           where: {
               ShoppingListId: shoppingListId,
               ProductId: productId
           },
           attributes: ['amount']
       }),
       Product.find({
           where: {
               id: productId
           },
           attributes: ['id', 'name']
       })
   ]).spread((shoppingListItem, product) => {
       const plainShoopingListItem = shoppingListItem.get({plain: true});
       const plainProduct = product.get({plain: true});

       return {
           id: plainProduct.id,
           name: plainProduct.name,
           amount: plainShoopingListItem.amount
       };
   });
}

export function deleteProduct(shoppingListId, productId) {
    return ShoppingListItem.destroy({
        where: {
            ShoppingListId: shoppingListId,
            ProductId: productId
        }
    });
}
