import * as AuthController from './auth.controller';
import {InvalidCredentialsError} from './auth.errors';

const Promise = require('bluebird');

export default [
    {
        path: '/tokens',
        method: 'POST',
        config: {
            handler(request, reply) {
                const name = request.payload.name;
                const password = request.payload.password;

                Promise.try(() => {
                    return AuthController.verifyUsernameAndPassword(name, password);
                }).then(({token, user}) => {
                    reply({
                        data: {token, user}
                    });
                }).catch(InvalidCredentialsError, e => {
                    reply({
                        error: e.message
                    }).code(401);
                }).catch(e => {
                    reply(e);
                });
            }
        }
    }
];
