import models from './../../models/app.models';
const Promise = require('bluebird');
const jwt = require('jsonwebtoken');

const SECRET = 'fdgd4JK%34bwf0s-sdl';

export function verifyUsernameAndPassword(name, password) {
    return models.User.find({
        where: {name},
        attributes: ['id', 'name', 'passwordHash']
    }).then(user => {
        if (!user) {
            throw new Error();
        }

        if (!user.comparePassword(password)) {
            throw new Error();
        }

        return generateToken(user.get('id'))
    });
}

function generateToken(id) {
    return jwt.sign({id}, SECRET);
}

export function verifyToken(token) {
    const asyncVerify = Promise.promisify(jwt.verify, {context: jwt});
    return asyncVerify(token, SECRET);
}

export function verifyTokenForUser(token, id) {
    return verifyToken(token).then(() => {
        const decoded = jwt.decode(token);

        if(decoded.id === id) {
            return Promise.resolve();
        } else {
            return Promise.reject();
        }
    });
}
