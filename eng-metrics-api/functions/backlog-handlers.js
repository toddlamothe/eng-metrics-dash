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
    if (!event.pathParameters.backlogId) {
        const responseMessage = {
            statusCode: 500,
            body: "Backlog ID not provided"
        };
        callback(JSON.stringify(responseMessage));
    }
    
    backlogId = event.pathParameters.backlogId;
    backlogEpicsUri = "https://unionstmedia.atlassian.net/rest/agile/1.0/board/" + backlogId + "/epic";

    // Fetch epics
    await fetch(
        backlogEpicsUri, {
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
        
        // Process each epic in the backlog. If the epic is tagged for Budget-Reporting,
        // add to the cumulative total, in progress, complete and completed point totals 
        storyPointEstimateField = "customfield_10035";
        data.values.map( (element, index, array) => {
            // Fetch issues for this epic
            let epicId = element.key;
            epicIssuesUri = "https://unionstmedia.atlassian.net/rest/agile/1.0/epic/" + epicId + "/issue"
            // Fetch EPIC issues
            await fetch\(
                backlogepicIssuesUriEpicsUri, {
                method: 'GET',
                headers: {
                    Authorization: 'Basic dGxhbW90aGVAdW5pb25zdG1lZGlhLmNvbTp5R2xrV3RVZ2V5d1Jjbk9SZ25uRkQ1Nzg=',
                }
             })
            //  .then(response => {

            //  })
             .then(data => {
                console.log("Issue:");
                console.log(data);
             })
            //  .catch((error) => {
            //     callback(Error(error));
            // });

        

        })




        const responseBody = {
            epicCount: data.values.length,
            epics: data.values
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
}

module.exports.backlogEpics({pathParameters: { backlogId: 23}}, null, (error, response) => console.log(response))