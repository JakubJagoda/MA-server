import * as UsersController from './users.controller';
const Promise = require('bluebird');

export default [
    {
        path: '/users',
        method: 'POST',
        config: {
            handler(request, reply) {
                Promise.try(() => {
                    return UsersController.createUser(request.payload.name, request.payload.password);
                }).then(() => {
                    reply().code(201);
                }).catch(err => {
                    reply(err);
                });
            }
        }
    },
    {
        path: '/users/{userId}',
        method: 'GET',
        config: {
            handler(request, reply) {
                Promise.try(() => {
                    return UsersController.getUserDetails(request.params.userId);
                }).then(user => {
                    reply({
                        data: user
                    });
                }).catch(e => {
                    reply(e);
                });
            },
            auth: 'jwt-user'
        }
    },
    {
        path: '/users/{userId}/shopping-lists',
        method: 'GET',
        config: {
            handler(request, reply) {
                Promise.try(() => {
                    return UsersController.getUserShoppingLists(request.params.userId);
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
                    return UsersController.getUserShoppingList(request.params.userId, request.params.shoppingListId);
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
                    return UsersController.createShoppingListForUser(request.params.userId)
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
                    return UsersController.addProductToShoppingList(request.params.shoppingListId, request.payload.productId, request.payload.amount)
                }).then(() => {
                    reply().code(201);
                }).catch(err => {
                    reply(err);
                });
            },
            auth: {
                mode: 'required',
                strategy: 'jwt-user',
                payload: false
            }
        }
    },
    {
        path: '/users/{userId}/shopping-lists/{shoppingListId}/products/{productId}',
        method: 'PUT',
        config: {
            handler(request, reply) {
                Promise.try(() => {
                    return UsersController.updateProduct(request.params.shoppingListId, request.params.productId, request.payload.product)
                }).then(() => {
                    reply().code(201);
                }).catch(err => {
                    reply(err);
                });
            },
            auth: {
                mode: 'required',
                strategy: 'jwt-user'
            }
        }
    }
];
