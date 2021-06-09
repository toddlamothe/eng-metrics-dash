const fetch = require('node-fetch');

module.exports.exportBacklogEpicsGoogleSheet = (event, context, callback) => {
    if (!event.backlogId) {
        const responseMessage = {
            statusCode: 500,
            body: "Backlog ID not provided"
        };
        callback(JSON.stringify(responseMessage));
    }

    const backlogApiUrl = process.env.GW_URL + '/backlogs/' + event.backlogId + '/epics';
    console.log("backlogApiUrl = ", backlogApiUrl);
    // Fetch specified backlog and epics
    fetch(
        backlogApiUrl , {
        method: 'GET',
        headers: {
            Authorization: process.env.ATLASSIAN_API_KEY,
        }
     })
        .then(response => {
            if (!response.ok) {
                const responseMessage = {
                    statusCode: response.status,
                    body: response.statusText
                };
                callback(JSON.stringify(responseMessage));
            }
            return response.json()            
        })
        .then(data => {
            console.log("data = ", data);
            // const responseBody = {
            //     boardCount: data.total,
            //     boards: data.values
            // }

            // const responseMessage = {
            //     "isBase64Encoded": false,
            //     "statusCode": 200,
            //     "headers": {
            //     },
            //     "body": JSON.stringify(responseBody)
            // }            
            // callback(null, responseMessage);
        }).catch((error) => {
            callback(Error(error));
        });

    
}

// module.exports.exportBacklogEpicsGoogleSheet({}, null, () => console.log("callback ;)"));