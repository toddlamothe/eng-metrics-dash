let mysql = require("mysql");
let backlogHandlers = require("./backlog-handlers.js");

module.exports.etlBacklogEpics = async (event, context, callback) => {
    // This is bad.
    hardCodedBacklogIdNames = {
        23 : "Map Search",
        32 : "Beacon"
    }

    if (!event.backlogIds) {
        const responseMessage = {
            statusCode: 500,
            body: "Backlog IDs not provided"
        };
        callback(JSON.stringify(responseMessage));
        return;
    }

    // Open database connection
    let connection = openDbConnection();
    var insertStatement;

    for (const backlogId of event.backlogIds) {
        // Get backlog and epic data for specified ID
        try {
            await backlogHandlers.backlogEpics(
                {"pathParameters" : {"backlogId" : backlogId}},
                null,
                (errorMessage, responseMessage) => {
                    // Insert backlog data into the database
                    backlog = JSON.parse(responseMessage.body);
                    insertStatement = "INSERT INTO backlog VALUES (" + 
                        "UUID(), " +
                        backlogId + ", " + 
                        "'" + hardCodedBacklogIdNames[backlogId] + "', " + 
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
    
                    connection.query(insertStatement, function(err, results, fields) {
                        if (err) {
                            console.log(err.message);
                        }
                    });

                    for (const epic of backlog.epics) {
                        console.log("Epic: ", epic.name)
                        insertStatement = "INSERT INTO epic VALUES (" + 
                            "UUID(), " +
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
                            
                        connection.query(insertStatement, function(err, results, fields) {
                            if (err) {
                                console.log(err.message);
                            }
                        });
                    }

                })               
        } catch (error) {
            // Close database connection
            closeDbConnection(connection);            
        }
    }

    // Close database connection
    closeDbConnection(connection);

    // For each backlog ID provided, fetch backlog and epic data from 
    // Atlassian API and store it in a relational RDS database

    callback(null, event.backlogIds);
}

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

function openDbConnection() {
    let connection = mysql.createConnection({
        host: 'eng-metrics.cgwxrjuo6oyd.us-east-1.rds.amazonaws.com',
        user: 'admin',
        password: 'usm4ever',
        database: 'eng_metrics'
    });  

    connection.connect(function(err) {
        if (err) {
          return console.error('error: ' + err.message);
        }
      
        console.log('Connected to the MySQL server.');
      });
    
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

module.exports.etlBacklogEpics({backlogIds: [23, 32]}, null, (error, response) => console.log(response));