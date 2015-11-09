import models from './../../models/app.models';
const {Product, ShoppingListItem} = models;
const Promise = require('bluebird');

export function getProducts() {
    return Product.findAll({
        attributes: ['id', 'name']
    }).then(products => {
        return products.map(product => product.get());
    });
}
