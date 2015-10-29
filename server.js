'use strict';

import routes from './modules/app.routes';
import models from './models/app.models';
import {verifyToken, verifyTokenForUser} from './modules/auth/auth.controller';

const Hapi = require('hapi');
const server = new Hapi.Server();
const Promise = require('bluebird');

server.connection({
    port: process.env.PORT || 5000,
    routes: {cors: true}
});

server.register(require('hapi-auth-bearer-token'), function () {
    server.auth.strategy('jwt-user', 'bearer-access-token', {
        validateFunc(token, callback) {
            const request = this;
            Promise.try(() => {
                return verifyTokenForUser(token, Number(request.params.userId));
            }).then(() => {
                callback(null, true, {token});
            }).catch(e => {
                console.error(e);
                callback(null, false);
            });
        }
    });
});

for (const route of routes) {
    server.route(route);
}

server.start(function () {
    console.log('*** Server running at:', server.info.uri);
});

models.sequelize.authenticate().then(function () {
    return models.sequelize.sync();
}).then(function () {
    console.log('*** Connection to the database has been established successfully.');
}).catch(function (err) {
    console.error('Unable to connect to the database:', err);
    return Promise.reject(err);
});

server.ext('onPreResponse', function (request, reply) {
    if (request.response.output && request.response.output.statusCode === 500) {
        var e = request.response;
        var replyData = {};
        console.error(new Date(), e.name, e.message, e.stack);

        replyData.error = {
            name: e.name,
            message: e.message,
            stack: e.stack
        };

        return reply(replyData).code(500);
    } else {
        reply.continue();
    }
});
