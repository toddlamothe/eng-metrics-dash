const mysql = require('mysql2/promise');
const helpers = require('./helpers')

module.exports.etlBacklogEpics = async (event, context, callback) => {
    console.log("Begin etl execution");
    if (!event.backlogId) {
        const responseMessage = {
            statusCode: 500,
            body: "Backlog ID not provided"
        };
        callback(JSON.stringify(responseMessage));
        return;
    }

    const backlogId = event.backlogId;
    const backlogName = event.backlogName;
    var insertStatement = "";
    var insertArray = [];

    console.log("Fetching epics from Atlassian API...");
    await helpers.backlogEpics(
        {"pathParameters" : {"backlogId" : backlogId}},
        null,
        async (errorMessage, responseMessage) => {
            // Create backlog data insert statement
            backlog = JSON.parse(responseMessage.body);
            backlogUuid = helpers.uuidv4();

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
                ");";

            insertArray.push(insertStatement);

            var epicInserts;
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
                    epic.issuesDone + ", " + 
                    epic.issuesInProgress + ", " + 
                    epic.issuesToDo + ", " + 
                    epic.issuesUnestimated + ", " + 
                    epic.issuesPercentComplete + ", " + 
                    "now()" +
                    ");";

                insertArray.push(insertStatement);                
            };
    })


    // Execute all insert statements at once without nesting async/awaits, as the
    // database connection seems to drop when nesting calls
    console.log("Connecting to database...");
    var connection = await mysql.createConnection( {
        host: 'eng-metrics.cgwxrjuo6oyd.us-east-1.rds.amazonaws.com',
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: 'eng_metrics',
        debug: false
    }); 
    console.log("Database connected.");

    var selectRows, selectFields
    for(var x=0;x<insertArray.length;x++) {
        [selectRows, selectFields] = await connection.query(insertArray[x]);
    }

    connection.end()
    callback(null, null);
}

module.exports.etlBacklogEpics({backlogId: 23, backlogName: "Map Search"}, null, (error, response) => {
    console.log(response);
})

// module.exports.etlBacklogEpics({backlogId: 32, backlogName: "Beacon"}, null, (error, response) => {
//     console.log(response);
// })