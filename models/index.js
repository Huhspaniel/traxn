const models = {
    ƒ: require('./db-functions'),
    User: require('./User.js'),
    Track: require('./Track.js'),
    DM: require('./DM.js')
};
models.ƒ = require('./db-functions')(models);

module.exports = models;