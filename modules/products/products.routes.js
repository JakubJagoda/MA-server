import * as ProductsController from './products.controller';
const Promise = require('bluebird');

export default [
    {
        path: '/products',
        method: 'GET',
        config: {
            handler(request, reply) {
                Promise.try(() => {
                    return ProductsController.getProducts();
                }).then(products => {
                    reply({
                        data: products
                    });
                }).catch(e => reply(e))
            }
        }
    }
]
