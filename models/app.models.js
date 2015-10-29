// model loader helper, as proposed by Sequelize authors:
// https://github.com/sequelize/express-example/blob/master/models/index.js

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const sequelize = new Sequelize('database', 'username', 'password', {
    host: 'localhost',
    dialect: 'sqlite',

    pool: {
        max: 5,
        min: 0,
        idle: 10000
    },

    // SQLite only
    storage: './db/db.sqlite'
});

const db = {};

fs.readdirSync(__dirname)
    .filter(function (file) {
        return (file.indexOf('.') !== 0) && (file !== 'app.models.js');
    })
    .forEach(function (file) {
        const model = sequelize['import'](path.join(__dirname, file));
        db[model.name] = model;
    });

Object.keys(db).forEach(function (modelName) {
    if ('associate' in db[modelName]) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
