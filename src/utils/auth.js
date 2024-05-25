const { db } = require('../libs/database');

const vars = {
    credentials: {},
};

async function checkAuth() {
    try {
        const doc = await db.findOne({ _id: 'credentials' }).exec();
        vars.credentials = doc || {};
        return Object.keys(vars.credentials).length > 0;
    } catch (err) {
        console.error('Error fetching credentials:', err);
        return false;
    }
}

module.exports = { checkAuth };
