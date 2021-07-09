let mySql = require("mysql");

module.exports.etlBacklogEpics(event, context, callback) {
    if (!event.backlogIds) {
        const responseMessage = {
            statusCode: 500,
            body: "Backlog IDs not provided"
        };
        callback(JSON.stringify(responseMessage));
    }

    // For each backlog ID provided, fetch backlog and epic data from 
    // Atlassian API and store it in a relational RDS database

}

function pushBacklogData(backlogData) {

}

function pushEpicData(backlogEpics) {
    
}