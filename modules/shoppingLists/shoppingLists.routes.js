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
        path: '/users/{userId}/shopping-lists/{shoppingListId}/products',
        method: 'POST',
        config: {
            handler(request, reply) {
                Promise.try(() => {
                    return ShoppingListController.addProductToShoppingList(request.params.shoppingListId, request.payload.productId, request.payload.amount)
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
        path: '/users/{userId}/shopping-lists/{shoppingListId}/products/{productId}',
        method: 'GET',
        config: {
            handler(request, reply) {
                Promise.try(() => {
                    return ShoppingListController.getProduct(request.params.shoppingListId, request.params.productId)
                }).then(product => {
                    reply({
                        data: product
                    });
                }).catch(err => {
                    reply(err);
                });
            },
            auth: 'jwt-user'
        }
    },
    {
        path: '/users/{userId}/shopping-lists/{shoppingListId}/products/{productId}',
        method: 'PUT',
        config: {
            handler(request, reply) {
                Promise.try(() => {
                    return ShoppingListController.updateProduct(request.params.shoppingListId, request.params.productId, request.payload.shoppingListItem)
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
        path: '/users/{userId}/shopping-lists/{shoppingListId}/products/{productId}',
        method: 'DELETE',
        config: {
            handler(request, reply) {
                Promise.try(() => {
                    return ShoppingListController.deleteProduct(request.params.shoppingListId, request.params.productId)
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
