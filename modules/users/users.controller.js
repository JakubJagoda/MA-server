import models from './../../models/app.models';
import {DuplicatedUsernameError} from './users.errors';
const {User} = models;
const Promise = require('bluebird');

export function createUser(name, password) {
    return User.findOrCreate({
        where: {name}
    }).spread((user, wasUserCreated) => {
        if (!wasUserCreated) {
            return Promise.reject(new DuplicatedUsernameError());
        }

        user.set('password', password);
        return user.save();
    }).then(user => user.createShoppingList());
}

export function getUserDetails(userId) {
    return User.find({
        where: {
            id: userId
        },
        attributes: ['id', 'name']
    }).then(user => user.get());
}


