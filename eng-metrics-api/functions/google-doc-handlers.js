const fetch = require('node-fetch');

module.exports.exportBacklogEpicsGoogleSheet = async (event, context, callback) => {
    console.log("[exportBacklogEpicsGoogleSheet]");
    console.log("process.env.GW_URL = ", process.env.GW_URL);
    callback(null);
}

// module.exports.exportBacklogEpicsGoogleSheet({}, null, () => console.log("callback ;)"));