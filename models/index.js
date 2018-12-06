const models = {
    ƒ: require('./db-functions'),
    User: require('./User.js'),
    Track: require('./Track.js')
};
models.ƒ = require('./db-functions')(models);

module.exports = models;