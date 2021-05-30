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

// module.exports.backlogEpicsv1 = async (event, context, callback) => {
//     if (!event.pathParameters.backlogId) {
//         const responseMessage = {
//             statusCode: 500,
//             body: "Backlog ID not provided"
//         };
//         callback(JSON.stringify(responseMessage));
//     }
    
//     backlogId = event.pathParameters.backlogId;
//     backlogEpicsUri = "https://unionstmedia.atlassian.net/rest/agile/1.0/board/" + backlogId + "/epic";
//     var responseBody
//     var epicArray;

//     console.log("1");

//     // Fetch epics
//     await fetch(
//         backlogEpicsUri, {
//         method: 'GET',
//         headers: {
//             Authorization: 'Basic dGxhbW90aGVAdW5pb25zdG1lZGlhLmNvbTp5R2xrV3RVZ2V5d1Jjbk9SZ25uRkQ1Nzg=',
//         }
//      })
//      .then(response => {
//         return response.json()            
//     })
//     .then(data => {
//         console.log("2");
//         epicArray = data.values.map((element, index, array) => {
//             return { 
//                 "id" : element.id,
//                 "key" : element.key,
//                 "name" : element.name
//             }
//         })
//     }).catch((error) => {
//         callback(Error(error));
//     });

//     // For each epic, fetch epic issues and tally counts and point totals
//     var epicIssueTotal, epicIssuesToDo, epicIssuesInProgress, epicIssuesDone, epicPointTotal;
//     console.log("3");
//     var epicArrayWithIssues = epicArray.map( (element, index, array) => {
//         var epicIssuesUri = "https://unionstmedia.atlassian.net/rest/agile/1.0/epic/" + element.key + "/issue"
//         // Fetch EPIC issues
//         fetch(
//             epicIssuesUri, {
//             method: 'GET',
//             headers: {
//                 Authorization: 'Basic dGxhbW90aGVAdW5pb25zdG1lZGlhLmNvbTp5R2xrV3RVZ2V5d1Jjbk9SZ25uRkQ1Nzg=',
//             }
//             })
//             .then(response => {
//             return response.json()            
//         })
//             .then(data => {
//                 console.log("4");
//                 // console.log(data);
//             })
//             .catch((error) => {
//             callback(Error(error));
//         });        
//     })
//     console.log("5");

//     storyPointEstimateField = "customfield_10035";

//     responseBody = {
//         epicCount: epicArray.length,
//         epics: epicArray
//     }

//     const responseMessage = {
//         "isBase64Encoded": false,
//         "statusCode": 200,
//         "headers": {
//         },
//         "body": JSON.stringify(responseBody)
//     }            
//     callback(null, responseMessage);
// }

// Get all epics for the backlog containing the "Budget-Reporting" tag
// Then talle the total points, stories done/in progress/to do
module.exports.backlogEpics = async (event, context, callback) => {
    if (!event.pathParameters.backlogId) {
        const responseMessage = {
            statusCode: 500,
            body: "Backlog ID not provided"
        };
        callback(JSON.stringify(responseMessage));
    }

    // 1. Fetch the backlog
    backlogId = event.pathParameters.backlogId;
    backlogEpicsUri = "https://unionstmedia.atlassian.net/rest/agile/1.0/board/" + backlogId + "/epic";
    var responseBody
    var epicArray;

    console.log("1");

    // Fetch epics
    await fetch(
        backlogEpicsUri, {
        method: 'GET',
        headers: {
            Authorization: 'Basic dGxhbW90aGVAdW5pb25zdG1lZGlhLmNvbTp5R2xrV3RVZ2V5d1Jjbk9SZ25uRkQ1Nzg=',
        }
     })
     .then(response => {
        return response.json()            
    })
    .then(data => {

        console.log("2");

        epicArray = data.values.map((element, index, array) => {
            return { 
                "id" : element.id,
                "key" : element.key,
                "name" : element.name
            }
        })
    }).catch((error) => {
        callback(Error(error));
    });

    console.log("3");

    // 2. epicArray now contains an array of backlog epics.
    //    For each epic labeled Budget-Reporting, fetch all issues

    // Consider: map/reduce where each time we call map, we fetch labels for that 
    // epic and only return it if the epic has the Budget-Reporting label
    // In the reduce, we fetch all issues for that epic and tally up the points and issue counts
    // But, need to figure out how to nest a synchronous fetch inside map reduce



    //      3. Tally up stats for this epic

    // 4. Return retults
    var responseBody = {
        // epicCount: epicArray.length,
        // epics: epicArray
    }
    const responseMessage = {
        "isBase64Encoded": false,
        "statusCode": 200,
        "headers": {
        },
        "body": JSON.stringify(responseBody)
    }            
    callback(null, responseMessage);

}


module.exports.backlogEpics({pathParameters: { backlogId: 23}}, null, (error, response) => console.log(response))