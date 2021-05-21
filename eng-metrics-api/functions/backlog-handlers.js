const fetch = require('node-fetch');

module.exports.backlogs = async (event, context, callback) => {
    await fetch(
        'https://unionstmedia.atlassian.net/rest/agile/1.0/board/', {
        method: 'GET',
        headers: {
            Authorization: 'Basic dGxhbW90aGVAdW5pb25zdG1lZGlhLmNvbTp5R2xrV3RVZ2V5d1Jjbk9SZ25uRkQ1Nzg=',
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
            const responseBody = {
                boardCount: data.total,
                boards: data.values
            }

            const responseMessage = {
                "isBase64Encoded": false,
                "statusCode": 200,
                "headers": {
                },
                "body": JSON.stringify(responseBody)
            }            
            callback(null, responseMessage);
        }).catch((error) => {
            callback(Error(error));
        });
};

module.exports.backlogEpics = async (event, context, callback) => {
    let response = {
        status : 200,
        body: 'EPIC!'
    }
    callback(null, JSON.stringify(response));
}

// module.exports.backlogs(null, null, (error, response) => console.log(JSON.parse(response).body))