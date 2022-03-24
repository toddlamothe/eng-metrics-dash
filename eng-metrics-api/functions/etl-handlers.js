const mysql = require('mysql2/promise');
const helpers = require('./helpers')

/*
Fetch a list of active releases
For each active release in the database, ETL the backlogs epics and velocities for that release
*/
module.exports.etlActiveReleases = async (event, context, callback) => {
  console.log("[etlActiveReleases]");

  console.log("Connecting to database...");
  var connection = await mysql.createConnection( {
      host: 'eng-metrics.cgwxrjuo6oyd.us-east-1.rds.amazonaws.com',
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: 'eng_metrics',
      debug: false
  }); 
  console.log("Database connected");

  const [activeReleases, fields] = await connection.query('SELECT * FROM `release` WHERE is_active=true;');

  connection.end()

  for (let x=0;x<activeReleases.length;x++) {
      var activeRelease = activeReleases[x];
      // console.log("activeReleases[" + x + "] = ", activeReleases[x]);
      console.log("ETL'ing epics for '" + activeRelease["release_name"] + "' (backlog id " + activeRelease["backlog_id"] + ")");
      // ETL backlog epics for the specified release
      await module.exports.etlBacklogEpics({backlogId: activeRelease["backlog_id"], backlogName: activeRelease["release_name"]}, null, (error, response) => {
          console.log(response);
      })
  };

  callback(null, null);
}

/*
Fetch epics from the specified backlog tagged with 
the 'budget-reporting' label and load them into the database
*/
module.exports.etlBacklogEpics = async (event, context, callback) => {
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
            console.log(backlog);
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

/*
Fetch velocities for the specified backlog and add them to the database
*/
module.exports.etlVelocity = async (event, context, callback) => {
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

    const [dbSprintVelocities, fields] = await connection.query('SELECT * FROM sprint WHERE backlog_id = ' + event.backlogId);
    // Create a key/value hash from the recordset we can use to quickly 
    // check if a sprint returned from the API is already in the database
    var dbSprintVelocitiesHash = {};
    for (let x=0;x<dbSprintVelocities.length;x++) {
        var dbSprintVelocity = dbSprintVelocities[x];
        dbSprintVelocitiesHash[dbSprintVelocity.sprint_id] = dbSprintVelocity;
    };

    // Create insert statements for sprints and their velo's
    var insertStatement;
    apiSprintVelocities.map( (apiSprint) => {
        // If this is a closed sprint and is not in the database, add an insert statement for it
        if (!dbSprintVelocitiesHash[apiSprint.id] && apiSprint.state==='closed') {
            // Sprint is not in the database. Add insert statement
            insertStatement = "INSERT INTO sprint VALUES (" + 
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
        // If this is a closed sprint that is already in the database, 
        // and if the API returns a positive value for estimate/done,
        // update velo numbers for that sprint
        else if (dbSprintVelocitiesHash[apiSprint.id] && (apiSprint.estimated>0 || apiSprint.completed>0)) {
            insertStatement = "UPDATE sprint SET " + 
                "points_estimated = " + apiSprint.estimated + ", " + 
                "points_done = " + apiSprint.completed + 
                " WHERE backlog_id=" + event.backlogId + 
                " AND sprint_id = " + apiSprint.id
            console.log(insertStatement);
            insertArray.push(insertStatement);
        }
    })

    try {
        // Execute insert statements
        var insertRows, insertFields;
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

/*
Fetch all issues (stories/tech/defects/spikes) in any active 
sprints for the given backlog and sync them to the database

This function does not ETL the sprints themselves, just issues
for any active sprints
*/
module.exports.etlActiveSprintIssues = async (event, context, callback) => {
    if (!event.backlogId) {
        const responseMessage = {
            statusCode: 500,
            body: "Backlog ID not provided"
        };
        callback(JSON.stringify(responseMessage));
        return;
    }

    var apiActiveSprintsWithIssues;
    var insertArray = [];

    // Fetch active sprints and issues
    await helpers.backlogActiveSprintsWithIssues(event.backlogId, (activeSprintsWithIssues) => {
        apiActiveSprintsWithIssues = activeSprintsWithIssues || [];

        // 1. If the active sprint is not in the database, add it

        // 2. Delete and re-add any issues for the current sprint

    });

    console.log("helpers apiActiveSprintsWithIssues = ", apiActiveSprintsWithIssues);
}

// module.exports.etlActiveSprintIssues({backlogId : 23}, null, (error, results) => console.log(results));

// module.exports.etlVelocity({backlogId : 23}, null, (error, results) => console.log(results));

// module.exports.etlBacklogEpics({backlogId: 23, backlogName: "Map Search"}, null, (error, response) => {
//     console.log(response);
// })

// module.exports.etlBacklogEpics({backlogId: 32, backlogName: "Beacon"}, null, (error, response) => {
//     console.log(response);
// })

// module.exports.etlBacklogEpics({backlogId: 48, backlogName: "Lead-CRM Framework"}, null, (error, response) => {
//     console.log(response);
// })

// module.exports.etlVelocity({backlogId : 48}, null, (error, results) => console.log(results));

module.exports.etlActiveReleases(null, null, (error, response) => {
    console.log(response);
});