const db = {
    User: require('./User.js'),
    Track: require('./Track.js'),
    DM: require('./DM.js')
};
db._functions = require('./functions.js')(db);

module.exports = db;