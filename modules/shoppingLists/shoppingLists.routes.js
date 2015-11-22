import * as ShoppingListController from './shoppingLists.controller';
const Promise = require('bluebird');

export default [
    {
        path: '/users/{userId}/shopping-lists',
        method: 'GET',
        config: {
            handler(request, reply) {
                Promise.try(() => {
                    return ShoppingListController.getUserShoppingLists(request.params.userId);
                }).then(shoppingLists => {
                    reply({
                        data: shoppingLists
                    });
                }).catch(e => reply(e))
            },
            auth: 'jwt-user'
        }
    },
    {
        path: '/users/{userId}/shopping-lists/{shoppingListId}',
        method: 'GET',
        config: {
            handler(request, reply) {
                Promise.try(() => {
                    return ShoppingListController.getUserShoppingList(request.params.userId, request.params.shoppingListId);
                }).then(shoppingList => {
                    reply({
                        data: shoppingList
                    });
                }).catch(e => reply(e));
            },
            auth: 'jwt-user'
        }
    },
    {
        path: '/users/{userId}/shopping-lists',
        method: 'POST',
        config: {
            handler(request, reply) {
                Promise.try(() => {
                    return ShoppingListController.createShoppingListForUser(request.params.userId)
                }).then(() => {
                    reply().code(201);
                }).catch(err => {
                    reply(err);
                });
            },
            auth: 'jwt-user'
        }
    },
    {
        path: '/users/{userId}/shopping-lists/{shoppingListId}/items',
        method: 'POST',
        config: {
            handler(request, reply) {
                Promise.try(() => {
                    return ShoppingListController.addItemToShoppingList(request.params.shoppingListId, request.payload.itemName, request.payload.amount)
                }).then(createdItem => {
                    reply({
                        data: createdItem
                    }).code(201);
                }).catch(err => {
                    reply(err);
                });
            },
            auth: 'jwt-user'
        }
    },
    {
        path: '/users/{userId}/shopping-lists/{shoppingListId}/items/{itemId}',
        method: 'GET',
        config: {
            handler(request, reply) {
                Promise.try(() => {
                    return ShoppingListController.getItem(request.params.shoppingListId, request.params.itemId)
                }).then(item => {
                    reply({
                        data: item
                    });
                }).catch(err => {
                    reply(err);
                });
            },
            auth: 'jwt-user'
        }
    },
    {
        path: '/users/{userId}/shopping-lists/{shoppingListId}/items/{itemId}',
        method: 'PUT',
        config: {
            handler(request, reply) {
                Promise.try(() => {
                    return ShoppingListController.updateItem(request.params.shoppingListId, request.params.itemId, request.payload.shoppingListItem)
                }).then(() => {
                    reply().code(201);
                }).catch(err => {
                    reply(err);
                });
            },
            auth: 'jwt-user'
        }
    },
    {
        path: '/users/{userId}/shopping-lists/{shoppingListId}/items/{itemId}',
        method: 'DELETE',
        config: {
            handler(request, reply) {
                Promise.try(() => {
                    return ShoppingListController.deleteItem(request.params.shoppingListId, request.params.itemId)
                }).then(() => {
                    reply().code(204);
                }).catch(err => {
                    reply(err);
                });
            },
            auth: 'jwt-user'
        }
    }
]
