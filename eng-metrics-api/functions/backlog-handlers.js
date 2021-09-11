const mysql = require('mysql2/promise');

module.exports.backlogEpics = async (event, context, callback) => {
    // Opening and closing a conneciton on every call is probably bad technique
    const connection = await mysql.createConnection( {
        host: 'eng-metrics.cgwxrjuo6oyd.us-east-1.rds.amazonaws.com',
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: 'eng_metrics'
    });

    try {
        const backlogSelectStatement = "select * from backlog where backlog_id=" + event.pathParameters.backlogId + " order by created_dttm desc limit 1";    
        const [backlogRows, backlogFields] = await connection.query(backlogSelectStatement);
        var backlogEpicsResponseObject = JSON.parse(JSON.stringify(backlogRows[0]));
        var formattedBacklogEpicsResponseObject = formatBacklogObject(backlogEpicsResponseObject)
        formattedBacklogEpicsResponseObject.epics = [];
        console.log("formattedBacklogEpicsResponseObject = ", formattedBacklogEpicsResponseObject);

        var backlogEpicsSelectStatement = "select epic.* from backlog, epic where epic.backlog_uuid = backlog.uuid and backlog.uuid = '" + backlogEpicsResponseObject.uuid + "'";
        const [epicRows, epicFields] = await connection.query(backlogEpicsSelectStatement);
        for (const epic of epicRows) {
            formattedBacklogEpic = formatEpicObject(JSON.parse(JSON.stringify(epic)));
            formattedBacklogEpicsResponseObject.epics.push(formattedBacklogEpic)
        }

        const responseMessage = {
            "isBase64Encoded": false,
            "statusCode": 200,
            "headers": {
                "Access-Control-Allow-Origin" : "*",
                "Access-Control-Allow-Credentials" : "true"
            },
            "body": JSON.stringify(formattedBacklogEpicsResponseObject)
        }
        callback(null, responseMessage);

        connection.end()

        callback(null, {
            statusCode: 200, 
            body: "Success"
        });	            
    } catch (error) {
        console.log(error);
        callback(null, {
            statusCode: 200, 
            body: error
        });	            
    }
}

module.exports.backlogSprints = async (event, context, callback) => {
    // Opening and closing a conneciton on every call is probably bad technique
    const connection = await mysql.createConnection( {
        host: 'eng-metrics.cgwxrjuo6oyd.us-east-1.rds.amazonaws.com',
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: 'eng_metrics'
    });

    try {
        const sprintSelectStatement = "select * from velocity where (points_estimated>0 or points_done > 0) AND backlog_id=" + event.pathParameters.backlogId + " ORDER BY end_date ASC";
        const [sprintRows, sprintFields] = await connection.query(sprintSelectStatement);
        var sprintResponseObject = JSON.parse(JSON.stringify(sprintRows));

        connection.end()

        const responseMessage = {
            "isBase64Encoded": false,
            "statusCode": 200,
            "headers": {
                "Access-Control-Allow-Origin" : "*",
                "Access-Control-Allow-Credentials" : "true"
            },
            "body": JSON.stringify(sprintResponseObject)
        }
        callback(null, responseMessage);

    } catch (error) {
        console.log(error);
        connection.end()
        callback(null, {
            statusCode: 200, 
            body: error
        });	            
    }
};

function formatBacklogObject(backlogObject) {
    return {
        "uuid" : backlogObject.uuid,
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

// module.exports.backlogEpics({pathParameters: { backlogId: 32}}, {}, (error, response) => console.log(response))
// module.exports.backlogSprints({pathParameters: { backlogId: 23}}, {}, (error, response) => console.log(response))