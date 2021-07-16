const fetch = require('node-fetch');
let mysql = require("mysql");

module.exports.backlogEpics = async (event, context, callback) => {
    var connection;
    console.log("1");
    if (!event.pathParameters.backlogId) {
        const responseMessage = {
            statusCode: 500,
            body: "Backlog IDs not provided"
        };
        callback(JSON.stringify(responseMessage));
        return;
    }
    // try {
        console.log("2");
        connection = openDbConnection();
        console.log("3");
        var backlogSelectStatement;
        backlogSelectStatement = "select * from backlog where backlog_id=" + event.pathParameters.backlogId + " order by created_dttm desc limit 1";
        console.log("4");
        connection.query(backlogSelectStatement, (backlogErr, backlogResults, backlogFields) => {
            console.log("5");
            if (backlogErr) {
                console.log("6");
                console.log("An error occured querying MySql: ", backlogErr.message);
                callback(backlogErr.message);
                return;
            }
            console.log("7");
            var backlogEpicsResponseObject = JSON.parse(JSON.stringify(backlogResults[0]));
            var formattedBacklogEpicsResponseObject = formatBacklogObject(backlogEpicsResponseObject)
            formattedBacklogEpicsResponseObject.epics = [];

            var backlogEpicsSelectStatement = "select epic.* from backlog, epic where epic.backlog_uuid = backlog.uuid and backlog.uuid = '" + backlogEpicsResponseObject.uuid + "'";
            connection.query(backlogEpicsSelectStatement, function(epicErr, epicResults, epicFields) {
                if (epicErr) {
                    console.log(epicErr.message);
                    callback(backlogErr);
                }
                for (const epic of epicResults) {
                    formattedBacklogEpic = formatEpicObject(JSON.parse(JSON.stringify(epic)));
                    formattedBacklogEpicsResponseObject.epics.push(formattedBacklogEpic)
                }

                closeDbConnection(connection);
    
                const responseMessage = {
                    "isBase64Encoded": false,
                    "statusCode": 200,
                    "headers": {
                        "Access-Control-Allow-Origin" : "*",
                        "Access-Control-Allow-Credentials" : "true"
                    },
                    "body": JSON.stringify(formattedBacklogEpicsResponseObject)
                }    
                console.log("responseMessage!!!! ", responseMessage);        
                callback(null, responseMessage);
            })

        });            

    // } catch (error) {
    //     console.log("An error occurred: ", error);
    //     closeDbConnection(connection);            
    //     callback(error, null);
    // }
}

function openDbConnection2() {
    console.log("openDbConnection: 1");

    let connection = mysql.createConnection({
        host: 'eng-metrics.cgwxrjuo6oyd.us-east-1.rds.amazonaws.com',
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: 'eng_metrics'
    });  
    console.log("openDbConnection: 2");

    connection.connect(function(err) {              // The server is either down
        console.log("openDbConnection: 3");
        if(err) {                                     // or restarting (takes a while sometimes).
            console.log("openDbConnection: 3 Error");
            console.log('error when connecting to db:', err);
            console.log("openDbConnection: 3 setTimeout");
            setTimeout(openDbConnection, 2000); // We introduce a delay before attempting to reconnect,
        }                                     // to avoid a hot loop, and to allow our node script to
      });                                     // process asynchronous requests in the meantime.
                                              // If you're also serving http, display a 503 error.
    console.log("openDbConnection: 4");

      connection.on('error', function(err) {
        console.log("openDbConnection: 4 Error");
        console.log('db error', err);
        if(err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
            openDbConnection();                         // lost due to either server restart, or a
        } else {                                      // connnection idle timeout (the wait_timeout
          throw err;                                  // server variable configures this)
        }
      });  
      console.log("openDbConnection: 5");
      console.log("connection.state = ", connection.state);
      
      return connection;
}

function openDbConnection() {
    console.log("openDbConnection: 1");
    // host: 'eng-metrics.cgwxrjuo6oyd.us-east-1.rds.amazonaws.com',
    // database: 'eng_metrics'
    // host: 'test-db.cgwxrjuo6oyd.us-east-1.rds.amazonaws.com',
    let connection = mysql.createConnection({
        host: 'eng-metrics.cgwxrjuo6oyd.us-east-1.rds.amazonaws.com',
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: 'eng_metrics'
    });  
    // try {
        console.log("openDbConnection: 2");
        connection.connect(function(err) {
            console.log("openDbConnection: 3");
            console.log("Database is ", connection.state)
            if (err) {
                console.log("openDbConnection: 3-ERROR");
                return console.error('error: ' + err.message);
            }
          
            console.log('Connected to the MySQL server.');
        });
    // } catch (error) {
    //     console.log("openDbConnection: 1-ERROR");
    //     console.log("Database is ", connection.state)
    //     console.log("Error connecting to MySql: ", error);
    // }

    console.log("openDbConnection: 4");
    console.log("connection.state = ", connection.state);
    return connection;
}

function closeDbConnection(connection) {
    connection.end(function(err) {
        if (err) {
          return console.log('error:' + err.message);
        }
        console.log('Close the database connection.');
      });    
}


// Get all epics for the backlog containing the "Budget-Reporting" tag
// Then tally the total points, stories done/in progress/to do
module.exports.backlogEpics_OLD = async (event, context, callback) => {
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

    backlogEpicsUri = "https://unionstmedia.atlassian.net/rest/agile/1.0/board/" + backlogId + "/epic";

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
                "name" : element.name
            }
        })
    }).catch((error) => {
        callback(Error(error));
    });

    // Only include the epic if it was labeled with the budget reporting tag
    for (const epic of epicArray) {
        epicLabelsUri = "https://unionstmedia.atlassian.net/rest/agile/1.0/issue/" + epic.key + "?fields=labels"
        await fetch(
            epicLabelsUri, {
                method: 'GET',
                headers: {
                    Authorization: process.env.ATLASSIAN_API_KEY,
                }
             })     .then(response => {
                return response.json()            
            })
            .then(data => {
                if (data.fields.labels && data.fields.labels[0] && data.fields.labels[0] == budgetReportingTag) {
                    // Include this budget reporting epic
                    budgetReportingEpics.push(epic);
                }
                
            }).catch((error) => {
                callback(Error(error));
            });        
    }

    // epicArray now contains an array of backlog epics.
    // For each epic labeled Budget-Reporting, fetch all issues
    for (const epic of budgetReportingEpics) {
        // Only include if the epic was tagged with the budget reporting tag
        var epicTotalIssues=0, epicDoneIssues=0, epicInProgressIssues=0, epicToDoIssues=0, epicUnestimatedIssues=0;
        var epicTotalPoints=0, epicDonePoints=0, epicInProgressPoints=0, epicToDoPoints=0;

        await module.exports.epicIssues({pathParameters: { backlogId: 23, epicId : epic.id}}, null, (error, response) => {
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
                    epicUnestimatedIssues++;
                }
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
            

            epicsWithStats.push({ 
                "id" : epic.id,
                "key" : epic.key,
                "name" : epic.name,
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

function formatBacklogObject(backlogObject) {
    return {
        "id" : backlogObject.backlog_id,
        "name" : backlogObject.name,
        "epicCount": backlogObject.epic_count,
        "backlogTotalPoints": backlogObject.total_points,
        "backlogPointsDone": backlogObject.points_done,
        "backlogPointsInProgress": backlogObject.points_in_progress,
        "backlogPointsToDo": backlogObject.points_to_do,
        "backlogPointsPercentComplete": backlogObject.points_percent_complete,
        "backlogTotalIssues": backlogObject.total_issues,
        "backlogIssuesDone": backlogObject.issues_done,
        "backlogIssuesInProgress": backlogObject.issues_in_progress,
        "backlogIssuesToDo": backlogObject.issues_to_do,
        "backlogIssuesUnestimated": backlogObject.issues_unestimated,
        "backlogIssuesPercentComplete": backlogObject.issues_percent_complete,
        "updatedDttm" : backlogObject.created_dttm
    }
}

function formatEpicObject(epicObject) {
    return {
        "id" : epicObject.epic_id,
        "key" : epicObject.key,
        "name" : epicObject.name,
        "totalPoints": epicObject.total_points,
        "pointsDone": epicObject.points_done,
        "pointsInProgress": epicObject.points_in_progress,
        "pointsToDo": epicObject.points_to_do,
        "pointsPercentComplete": epicObject.points_percent_complete,
        "totalIssues": epicObject.total_issues,
        "issuesDone": epicObject.issues_done,
        "issuesInProgress": epicObject.issues_in_progress,
        "issuesToDo": epicObject.issues_to_do,
        "issuesUnestimated": epicObject.issues_unestimated,
        "issuesPercentComplete": epicObject.issues_percent_complete,
        "updatedDttm" : epicObject.created_dttm        
    }
}

module.exports.backlogs = async (event, context, callback) => {
    await fetch(
        'https://unionstmedia.atlassian.net/rest/agile/1.0/board/', {
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
                boardCount: data.total,
                boards: data.values
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

module.exports.epicIssues = async (event, context, callback) => {
    if (!event.pathParameters.backlogId || !event.pathParameters.epicId) {
        const responseMessage = {
            statusCode: 500,
            body: "Backlog ID and epic ID required"
        };
        callback(JSON.stringify(responseMessage));
    }

    var epicIssuesUri = "https://unionstmedia.atlassian.net/rest/agile/1.0/epic/" + event.pathParameters.epicId + "/issue";
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

// module.exports.epicIssues({pathParameters: { backlogId: 23, epicId : "A20-2137"}}, null, (error, response) => console.log(response))
module.exports.backlogEpics({pathParameters: { backlogId: 32}}, null, (error, response) => console.log(response))
// module.exports.backlogs({}, null, (error, response) => console.log(response))