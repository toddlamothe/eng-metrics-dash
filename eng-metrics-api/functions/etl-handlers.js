const fetch = require('node-fetch');
const mysql = require('mysql2/promise');

const config = {
    db: {
        host: 'eng-metrics.cgwxrjuo6oyd.us-east-1.rds.amazonaws.com',
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: 'eng_metrics',
        waitForConnections: true,
        connectionLimit: 5,
        queueLimit: 0,
        debug: false
    },
    listPerPage: 10,
};
  
async function query(pool, sql, params) {
    const [rows, fields] = await pool.execute(sql, params);
    return rows;
}

testMysql2Connection = async () => {
    const connection = await mysql.createConnection( {
        host: 'eng-metrics.cgwxrjuo6oyd.us-east-1.rds.amazonaws.com',
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: 'eng_metrics'
    });


    const [rows, fields] = await connection.query(
        'SELECT * FROM backlog'
      );
      console.log("rows = ", rows);

    connection.end()

}

module.exports.etlBacklogEpics = async (event, context, callback) => {

    if (!event.backlogId) {
        const responseMessage = {
            statusCode: 500,
            body: "Backlog ID not provided"
        };
        callback(JSON.stringify(responseMessage));
        return;
    }

    backlogId = event.backlogId;
    backlogName = event.backlogName;

    // Opening and closing a conneciton pool on every call is probably bad technique
    const pool = mysql.createPool(config.db);        
    var insertStatement;

    await backlogEpics(
        {"pathParameters" : {"backlogId" : backlogId}},
        null,
        async (errorMessage, responseMessage) => {
            // Insert backlog data into the database
            backlog = JSON.parse(responseMessage.body);
            backlogUuid = uuidv4();
            insertStatement = "INSERT INTO backlog VALUES (" + 
                "'" + backlogUuid + "', " +
                backlogId + ", " + 
                "'" + backlogName + "', " + 
                backlog.epicCount + ", " + 
                backlog.backlogTotalPoints + ", " + 
                backlog.backlogPointsDone + ", " + 
                backlog.backlogPointsInProgress + ", " + 
                backlog.backlogPointsToDo + ", " + 
                backlog.backlogPointsPercentComplete + ", " + 
                backlog.backlogTotalIssues + ", " + 
                backlog.backlogIssuesDone + ", " + 
                backlog.backlogIssuesInProgress + ", " + 
                backlog.backlogIssuesToDo + ", " + 
                backlog.backlogIssuesUnestimated + ", " + 
                backlog.backlogIssuesPercentComplete + ", " + 
                "now()" +
                ")";

            const backlogEtlResults = await query(pool, insertStatement);

            for (const epic of backlog.epics) {
                insertStatement = "INSERT INTO epic VALUES (" + 
                    "UUID(), " +
                    "'" + backlogUuid + "', " +
                    epic.id + ", " + 
                    "'" + epic.key + "', " + 
                    "'" + epic.name + "', " + 
                    epic.totalPoints + ", " + 
                    epic.pointsDone + ", " + 
                    epic.pointsInProgress + ", " + 
                    epic.pointsToDo + ", " + 
                    epic.pointsPercentComplete + ", " + 
                    epic.totalIssues + ", " + 
                    epic.issuesToDo + ", " + 
                    epic.issuesInProgress + ", " + 
                    epic.issuesDone + ", " + 
                    epic.issuesUnestimated + ", " + 
                    epic.issuesPercentComplete + ", " + 
                    "now()" +
                    ")";
                console.log(insertStatement);
                const epicEtlResults = await query(pool, insertStatement);
            }

            pool.end();
            callback(null, null);
    })


}

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

async function backlogEpics (event, context, callback) {
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
                "name" : element.name
            }
        })
    }).catch((error) => {
        console.log(error);
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
             }).then(response => {
                return response.json()            
            })
            .then(data => {
                if (data.fields.labels && data.fields.labels[0] && data.fields.labels[0] == budgetReportingTag) {
                    // Include this budget reporting epic
                    budgetReportingEpics.push(epic);
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

        await epicIssues({pathParameters: { backlogId: 23, epicId : epic.id}}, null, (error, response) => {
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

async function epicIssues(event, context, callback) {
    if (!event.pathParameters.backlogId || !event.pathParameters.epicId) {
        const responseMessage = {
            statusCode: 500,
            body: "Backlog ID and epic ID required"
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

// module.exports.etlBacklogEpics({backlogId: 32, backlogName: "Beacon"}, null, (error, response) => {
//     module.exports.etlBacklogEpics({backlogId: 23, backlogName: "Map Search"}, null, (error, response) => console.log(response))
// });


// module.exports.etlBacklogEpics({backlogId: 23, backlogName: "Map Search"}, null, (error, response) => {
//     console.log(response);
// })

// testMysql2Connection();