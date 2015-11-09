import * as UsersController from './users.controller';
import {DuplicatedUsernameError} from './users.errors';
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
                }).catch(DuplicatedUsernameError, e => {
                    reply({
                        error: e.message
                    }).code(409);
                }).catch(e => {
                    reply(e);
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
    }
];
