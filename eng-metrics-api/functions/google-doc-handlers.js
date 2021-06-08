const fetch = require('node-fetch');

module.exports.exportBacklogEpicsGoogleSheet = async (event, context, callback) => {
    console.log("[exportBacklogEpicsGoogleSheet]");
    callback(null);
}

module.exports.exportBacklogEpicsGoogleSheet({}, null, () => console.log("callback ;)"));