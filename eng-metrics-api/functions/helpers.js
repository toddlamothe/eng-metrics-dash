const fetch = require('node-fetch');

module.exports.uuidv4 = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
}

/* 
Gather and return all sprints for the given backlog including name, goal, velocity and dates
Sprint data is fetched from the Atlassian API and transformed. Due to the design of the Atlassian
API, multiple API calls are made - one to fetch sprint velocity data and another for sprint start/end dates
*/
module.exports.sprintVeloHistory = async (backlogId, callback) => {
    if (!backlogId) {
        // Throw an error
    }

    var backlogVelocitysUri = "https://unionstmedia.atlassian.net/rest/greenhopper/1.0/rapid/charts/velocity?rapidViewId=" + backlogId;
    var backlogSprintVelocitiesHash = {};
    var backlogSprintVelocities;
    // Fetch sprint velocity data. Note this endpoint only returns the most 
    // recent 7 sprints worth of data, which is awesome
    await fetch(
        backlogVelocitysUri, {
        method: 'GET',
        headers: {
            Authorization: process.env.ATLASSIAN_API_KEY,
        }
     })
     .then(response => {
        return response.json()            
    })
    .then(data => {
        for (let x=0;x<data.sprints.length;x++) {
            var sprint = data.sprints[x];
            var sprintVelocity = {
                "id" : sprint.id,
                "name": sprint.name, 
                "state": sprint.state,
                "goal": sprint.goal
            };

            velocityStats = data.velocityStatEntries[sprint.id];
            if (velocityStats) {
                sprintVelocity.estimated = velocityStats.estimated.value;
                sprintVelocity.completed = velocityStats.completed.value;
            };

            backlogSprintVelocitiesHash[sprint.id] = sprintVelocity;
        }
    });

    // Now fetch sprint start/end dates
    await module.exports.sprintHistory(backlogId, (sprintHistoryWithDates) => {
        console.log("sprintHistoryWithDates.length = ", sprintHistoryWithDates.length);
        // For each sprint in the sprint history, add the sprint start/end date to 
        // the object that already contains sprint id, name and velo
        backlogSprintVelocities = sprintHistoryWithDates;

        for (let x=0;x<backlogSprintVelocities.length;x++) {
            backlogSprint = backlogSprintVelocities[x];
            backlogSprint.estimated = backlogSprintVelocitiesHash[backlogSprint.id] ? backlogSprintVelocitiesHash[backlogSprint.id].estimated : 0;
            backlogSprint.completed = backlogSprintVelocitiesHash[backlogSprint.id] ? backlogSprintVelocitiesHash[backlogSprint.id].completed : 0;            
        }
    });

    callback(backlogSprintVelocities);
}

module.exports.sprintHistory = async (backlogId, callback) => {
    if (!backlogId) {
        // Throw an error
    }

    var backlogSprintsUri = "https://unionstmedia.atlassian.net/rest/agile/1.0/board/" + backlogId + "/sprint?startAt=0&maxResults=250";
    var backlogSprints = [];
    var backlogSprintCount;

    // Fetch sprints
    await fetch(
        backlogSprintsUri, {
        method: 'GET',
        headers: {
            Authorization: process.env.ATLASSIAN_API_KEY,
        }
     })
     .then(response => {
        return response.json()            
    })
    .then(data => {
        backlogSprintCount = data.values.length;
        backlogSprints = data.values;
    })

    if (backlogSprintCount === 50) {
        // Fetch more sprints cuz the Atlassian API ignores maxResults and will only return 50
        backlogSprintsUri = "https://unionstmedia.atlassian.net/rest/agile/1.0/board/" + backlogId + "/sprint?startAt=50&maxResults=250";
        // Fetch sprints
        await fetch(
            backlogSprintsUri, {
            method: 'GET',
            headers: {
                Authorization: process.env.ATLASSIAN_API_KEY,
            }
        })
        .then(response => {
            return response.json()            
        })
        .then(data => {
            if(data.values.length > 0) {
                backlogSprintCount += data.values.length;
                // Append the next set of sprints onto the original 50
                // Note: this won't work if the backlog has more than 100 sprints
                backlogSprints = backlogSprints.concat(data.values);
            }            
        })
        callback(backlogSprints);
    }
}

module.exports.backlogEpics = async (event, context, callback) => {
    if (!event.pathParameters.backlogId) {
        const responseMessage = {
            statusCode: 500,
            body: "Backlog ID not provided"
        };
        callback(JSON.stringify(responseMessage));
    }

    const budgetReportingTag = "Budget-Reporting";
    var responseBody
    var epicArray, budgetReportingEpics = [], epicsWithStats = [];
    var backlogId = event.pathParameters.backlogId;
    var backlogTotalPoints=0, backlogPointsDone=0, backlogPointsInProgress=0, backlogPointsToDo=0;
    var backlogTotalIssues=0, backlogIssuesDone=0, backlogIssuesInProgress=0, backlogIssuesToDo=0, backlogIssuesUnestimated=0;

    backlogEpicsUri = "https://unionstmedia.atlassian.net/rest/agile/1.0/board/" + backlogId + "/epic?maxResults=1000";
    // Fetch epics
    await fetch(
        backlogEpicsUri, {
        method: 'GET',
        headers: {
            Authorization: process.env.ATLASSIAN_API_KEY,
        }
     })
     .then(response => {
        return response.json()            
    })
    .then(data => {
        epicArray = data.values.map((element, index, array) => {            
            return { 
                "id" : element.id,
                "key" : element.key,
                "name" : element.name,
                "fields" : element.fields
            }
        })
    }).catch((error) => {
        console.log(error);
        callback(Error(error));
    });

    for (const epic of epicArray) {
        epicLabelsUri = "https://unionstmedia.atlassian.net/rest/agile/1.0/issue/" + epic.key;
        await fetch(
            epicLabelsUri, {
                method: 'GET',
                headers: {
                    Authorization: process.env.ATLASSIAN_API_KEY,
                }
             }).then(response => {
                return response.json()            
            })
            .then(data => {
                // Only include the epic if it was labeled with the budget reporting tag
                if (data.fields.labels && data.fields.labels[0] && data.fields.labels[0] == budgetReportingTag) {
                    // Include this budget reporting epic
                    budgetReportingEpics.push(data);
                }
                
            }).catch((error) => {
                console.log(error)
                callback(Error(error));
            });        
    }

    // epicArray now contains an array of backlog epics.
    // For each epic labeled Budget-Reporting, fetch all issues
    for (const epic of budgetReportingEpics) {
        // Only include if the epic was tagged with the budget reporting tag
        var epicTotalIssues=0, epicDoneIssues=0, epicInProgressIssues=0, epicToDoIssues=0, epicUnestimatedIssues=0;
        var epicTotalPoints=0, epicDonePoints=0, epicInProgressPoints=0, epicToDoPoints=0;

        await epicIssues({pathParameters: {epicId : epic.id}}, null, (error, response) => {
            // Tally up stats for this epic
            allEpicIssues = JSON.parse(response.body).issues;
            allEpicIssues.forEach(issue => {
                var storyPoints = 0;
                epicTotalIssues++;
                if (issue.fields.customfield_10035){
                    storyPoints=issue.fields.customfield_10035;
                    epicTotalPoints+=storyPoints;
                } 
                else {
                    storyPoints = 0;
                }

                // Only count as unestimated if it's a user story
                if (issue.fields.issuetype && issue.fields.issuetype.name && issue.fields.issuetype.name==="Story" && storyPoints===0) {
                    epicUnestimatedIssues++;
                } else {
                    // The issue is not an unestimated user story, categorize it
                    switch(issue.fields.status.name) {
                        case "Done":
                            epicDoneIssues++;
                            epicDonePoints+=storyPoints;
                            break;
                        case "In Progress":
                            epicInProgressIssues++;
                            epicInProgressPoints+=storyPoints;
                            break;
                        case "To Do":
                            epicToDoIssues++;
                            epicToDoPoints+=storyPoints;
                            break;
                    }
                }
            });

            var epicIssuesPercentComplete = epicTotalIssues>0 ? epicDoneIssues/epicTotalIssues : 0
            var epicPointsPercentComplete = epicTotalPoints>0 ? epicDonePoints/epicTotalPoints : 0
            backlogTotalPoints+=epicTotalPoints;
            backlogPointsDone+=epicDonePoints;
            backlogPointsInProgress+=epicInProgressPoints;
            backlogPointsToDo+=epicToDoPoints;
            backlogTotalIssues+=epicTotalIssues;
            backlogIssuesDone+=epicDoneIssues;
            backlogIssuesInProgress+=epicInProgressIssues;
            backlogIssuesToDo+=epicToDoIssues;
            backlogIssuesUnestimated+=epicUnestimatedIssues;

            // If points were estimated at the epic level, 
            // use that value instead of the issue sum total
            if (epic.fields.customfield_10035) {
                epicTotalPoints = epic.fields.customfield_10035;
                epic.fields.customfield_10003 = epic.fields.customfield_10003;
            }

            epicsWithStats.push({ 
                "id" : epic.id,
                "key" : epic.key,
                "name" : epic.fields.customfield_10003,
                "totalPoints" : epicTotalPoints,
                "pointsToDo" : epicToDoPoints,
                "pointsInProgress" : epicInProgressPoints,
                "pointsDone" : epicDonePoints,
                "totalIssues" : epicTotalIssues,
                "issuesToDo" : epicToDoIssues,
                "issuesInProgress" : epicInProgressIssues,
                "issuesDone" : epicDoneIssues,
                "issuesUnestimated" : epicUnestimatedIssues,
                "issuesPercentComplete": epicIssuesPercentComplete,
                "pointsPercentComplete" : epicPointsPercentComplete
            })

        });
    }

    // Return retults
    var responseBody = {
        epicCount: epicsWithStats.length,
        backlogTotalPoints : backlogTotalPoints,
        backlogPointsDone : backlogPointsDone,
        backlogPointsInProgress : backlogPointsInProgress,
        backlogPointsToDo : backlogPointsToDo,
        backlogPointsPercentComplete : backlogPointsDone/backlogTotalPoints,
        backlogTotalIssues : backlogTotalIssues,
        backlogIssuesDone : backlogIssuesDone,
        backlogIssuesInProgress : backlogIssuesInProgress,
        backlogIssuesToDo : backlogIssuesToDo,
        backlogIssuesUnestimated : backlogIssuesUnestimated,
        backlogIssuesPercentComplete : backlogIssuesDone/backlogTotalIssues,
        epics: epicsWithStats
    }
    const responseMessage = {
        "isBase64Encoded": false,
        "statusCode": 200,
        "headers": {
            "Access-Control-Allow-Origin" : "*",
            "Access-Control-Allow-Credentials" : "true"
        },
        "body": JSON.stringify(responseBody)
    }            
    callback(null, responseMessage);

}

async function epicIssues(event, context, callback) {
    if (!event.pathParameters.epicId) {
        const responseMessage = {
            statusCode: 500,
            body: "Epic ID required"
        };
        callback(JSON.stringify(responseMessage));
    }

    var epicIssuesUri = "https://unionstmedia.atlassian.net/rest/agile/1.0/epic/" + event.pathParameters.epicId + "/issue?maxResults=1000";
    await fetch(
        epicIssuesUri, {
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
            const responseBody = {
                issues: data.issues
            }

            const responseMessage = {
                "isBase64Encoded": false,
                "statusCode": 200,
                "headers": {
                    "Access-Control-Allow-Origin" : "*",
                    "Access-Control-Allow-Credentials" : "true"
                },
                "body": JSON.stringify(responseBody)
            }
            callback(null, responseMessage);
        }).catch((error) => {
            callback(Error(error));
        });
};

// module.exports.sprintHistory(23, () => console.log("end."));
module.exports.sprintVeloHistory(32, () => console.log("end."));