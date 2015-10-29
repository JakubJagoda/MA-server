import * as AuthController from './auth.controller';
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
                }).then(token => {
                    reply({
                        data: { token }
                    });
                }).catch(e => {
                    reply(e).code(401);
                });
            }
        }
    }
];
