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
            var backlog = JSON.parse(responseMessage.body);
            var backlogUuid = helpers.uuidv4();

            insertStatement = "INSERT INTO backlog VALUES (" + 
                "'" + backlogUuid + "', " +
                backlogId + ", " + 
                "'" + backlogName + "', " + 
                backlog.epicCount + ", " + 
                backlog.backlogTotalPoints + ", " + 
                backlog.backlogPointsDone + ", " + 
                backlog.backlogPointsInProgress + ", " + 
                backlog.backlogPointsToDo + ", " + 
                (backlog.backlogPointsPercentComplete ? backlog.backlogPointsPercentComplete : 0) + ", " + 
                backlog.backlogTotalIssues + ", " + 
                backlog.backlogIssuesDone + ", " + 
                backlog.backlogIssuesInProgress + ", " + 
                backlog.backlogIssuesToDo + ", " + 
                backlog.backlogIssuesUnestimated + ", " + 
                (backlog.backlogIssuesPercentComplete ? backlog.backlogIssuesPercentComplete : 0) + ", " + 
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
                    (epic.pointsPercentComplete ? epic.pointsPercentComplete : 0) + ", " + 
                    epic.totalIssues + ", " + 
                    epic.issuesDone + ", " + 
                    epic.issuesInProgress + ", " + 
                    epic.issuesToDo + ", " + 
                    epic.issuesUnestimated + ", " + 
                    (epic.issuesPercentComplete ? epic.issuesPercentComplete : 0) + ", " + 
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
    console.log("Database connected");

    var selectRows, selectFields
    console.log("insertArray = ", insertArray);
    for(var x=0;x<insertArray.length;x++) {        
        [selectRows, selectFields] = await connection.query(insertArray[x]);
    }

    connection.end()
    callback(null, null);
}

module.exports.etlVelocity = async (event, context, callback) => {
    console.log("Begin etl execution");
    if (!event.backlogId) {
        const responseMessage = {
            statusCode: 500,
            body: "Backlog ID not provided"
        };
        callback(JSON.stringify(responseMessage));
        return;
    }

    var apiSprintVelocities;
    var insertArray = [];

    // Fetch velocities for the specified backlog
    await helpers.sprintVeloHistory(event.backlogId, (backlogVelocities) => {
        apiSprintVelocities = backlogVelocities || [];
    });

    console.log("Connecting to database...");
    var connection = await mysql.createConnection( {
        host: 'eng-metrics.cgwxrjuo6oyd.us-east-1.rds.amazonaws.com',
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: 'eng_metrics',
        debug: false
    }); 
    console.log("Database connected");

    // Add any new velocities to the database
    const [dbSprintVelocities, fields] = await connection.query('SELECT * FROM velocity WHERE backlog_id = ' + event.backlogId);

    // Create a key/value hash from the recordset
    var dbSprintVelocitiesHash = {};
    for (let x=0;x<dbSprintVelocities.length;x++) {
        var dbSprintVelocity = dbSprintVelocities[x];
        dbSprintVelocitiesHash[dbSprintVelocity.sprint_id] = dbSprintVelocity;
    };

    // Create insert statements for new sprints
    var insertStatement;
    apiSprintVelocities.map( (apiSprint) => {
        // If this is a closed sprint and is not in the
        // database, add an insert statement for it
        if (!dbSprintVelocitiesHash[apiSprint.id] && apiSprint.state==='closed') {
            // Sprint is not in the database. Add insert statement
            insertStatement = "INSERT INTO velocity VALUES (" + 
                event.backlogId + ", " + 
                apiSprint.id + ", " + 
                "'" + apiSprint.name + "', " + 
                "'" + apiSprint.state + "', " + 
                "\"" + apiSprint.goal + "\", " + 
                apiSprint.estimated + ", " + 
                apiSprint.completed + ", " + 
                "now(), " +
                "'" + apiSprint.startDate + "', " +
                "'" + apiSprint.endDate + "'" +
                ")";
            console.log(insertStatement);
            insertArray.push(insertStatement);
        }
    })

    try {
        // Execute insert statements
        var insertRows, insertFields;
        console.log("Inserting sprints: ", insertArray);
        for(var x=0;x<insertArray.length;x++) {
            [insertRows, insertFields] = await connection.query(insertArray[x]);
        };

    } catch (error) {
        console.error("Error inserting backlog velocities: ", error);
        console.log(insertArray);
    } finally {
        connection.end()
        console.log("Database disconnected");
    }
    
    callback(null, "done");
}

// module.exports.etlVelocity({backlogId : 32}, null, (error, results) => console.log(results));

// module.exports.etlBacklogEpics({backlogId: 23, backlogName: "Map Search"}, null, (error, response) => {
//     console.log(response);
// })

// module.exports.etlBacklogEpics({backlogId: 32, backlogName: "Beacon"}, null, (error, response) => {
//     console.log(response);
// })


// module.exports.etlBacklogEpics({backlogId: 48, backlogName: "Lead/CRM Framework"}, null, (error, response) => {
//     console.log(response);
// })
module.exports.etlVelocity({backlogId : 48}, null, (error, results) => console.log(results));
