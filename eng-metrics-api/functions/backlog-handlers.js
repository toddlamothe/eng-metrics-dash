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

module.exports.backlogEpics = async (event, context, callback) => {
    // Opening and closing a conneciton pool on every call is probably bad technique
    const pool = mysql.createPool(config.db);        

    try {
        const backlogSelectStatement = "select * from backlog where backlog_id=" + event.pathParameters.backlogId + " order by created_dttm desc limit 1";    
        const backlogResults = await query(pool, backlogSelectStatement);
        var backlogEpicsResponseObject = JSON.parse(JSON.stringify(backlogResults[0]));
        var formattedBacklogEpicsResponseObject = formatBacklogObject(backlogEpicsResponseObject)
        formattedBacklogEpicsResponseObject.epics = [];
        console.log("formattedBacklogEpicsResponseObject = ", formattedBacklogEpicsResponseObject);

        var backlogEpicsSelectStatement = "select epic.* from backlog, epic where epic.backlog_uuid = backlog.uuid and backlog.uuid = '" + backlogEpicsResponseObject.uuid + "'";
        const epicResults = await query(pool, backlogEpicsSelectStatement);
        for (const epic of epicResults) {
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

        pool.end();

        callback(null, {
            statusCode: 200, 
            body: "Success"
        });	            
    } catch (error) {
        pool.end();

        console.log(error);
        callback(null, {
            statusCode: 200, 
            body: error
        });	            
    }
}

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

// module.exports.backlogEpics({pathParameters: { backlogId: 23}}, {}, (error, response) => console.log(response))
