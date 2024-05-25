const { db } = require('../libs/database');

const vars = {
    credentials: {},
};

async function checkAuth(callback) {
    try {
        db.findOne({ _id: 'credentials' }, (err, doc)=>{
            vars.credentials = doc || {};
            callback(Object.keys(vars.credentials).length > 0);
        });
    } catch (err) {
        console.error('Error fetching credentials:', err);
        return false;
    }
}

module.exports = { checkAuth };
