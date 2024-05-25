let Datastore = require('nedb')
    , db = new Datastore({ filename: 'database.mg', autoload: true });

module.exports = { db }