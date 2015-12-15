import * as ShoppingListController from './shoppingLists.controller';
import * as Sync from './../sync/sync.module';
import {ShoppingListSyncConflict} from './shoppingLists.errors';
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
                    const meta = {};
                    for (const item of shoppingList.shoppingListItems) {
                        meta[item.id] = {
                            subtotals: {},
                            overall: item.amount
                        };

                        for (const [guid, subtotal] of Sync.getSubtotals(item.id).entries()) {
                            meta[item.id].subtotals[guid] = subtotal;
                        }
                    }

                    reply({
                        data: shoppingList,
                        meta
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
        path: '/users/{userId}/shopping-lists/{shoppingListId}',
        method: 'PUT',
        config: {
            handler(request, reply) {
                Promise.try(() => {
                    const deviceId = request.headers['x-device-id'];
                    const items = request.payload.data.items;
                    const meta = request.payload.meta;

                    for (const item of items) {
                        const subtotal = meta[item.id].subtotal;
                        Sync.setSubtotal(item.id, deviceId, subtotal);
                        item.amount = Sync.getOverall(item.id);
                    }

                    return ShoppingListController.overwriteList(request.params.shoppingListId, items);
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
        method: 'PUT',
        config: {
            handler(request, reply) {
                Promise.try(() => {
                    const deviceId = request.headers['x-device-id'];
                    const productId = request.params.itemId;
                    const meta = request.payload.meta;

                    const bucket = Sync.getSubtotals(productId);
                    for (const [guid, subtotal] of bucket.entries()) {
                        if (guid === deviceId) {
                            continue;
                        }

                        if (!meta[guid] || meta[guid] !== subtotal) {
                            throw new ShoppingListSyncConflict();
                        }
                    }

                    //get bucket and compare with what came in request
                    //if everything else is okay except the data for deviceId, then it's okay and we update
                    //if data for any other deviceId is different, return 409 and let the client update the data
                }).then(() => {
                    return ShoppingListController.updateItem(request.params.shoppingListId, request.params.itemId, request.payload.data.shoppingListItem)
                }).then(() => {
                    reply().code(201);
                }).catch(ShoppingListSyncConflict, e => {
                    reply(e).code(409);
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
