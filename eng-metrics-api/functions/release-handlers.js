const mysql = require('mysql2/promise');

module.exports.getReleases = async(event, context, callback) => {
    const connection = await mysql.createConnection( {
      host: 'eng-metrics.cgwxrjuo6oyd.us-east-1.rds.amazonaws.com',
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: 'eng_metrics'
  });

  let responseMessage = {
    "isBase64Encoded": false,
    "headers": {
        "Access-Control-Allow-Origin" : "*",
        "Access-Control-Allow-Credentials" : "true"
    }
  }

  try {
      const releasesSelectStatement = "select * from `release` where is_active=true ORDER BY release_name ASC";
      const [releaseRows, releaseFields] = await connection.query(releasesSelectStatement);
      var releasesResponseObject = JSON.parse(JSON.stringify(releaseRows));

      connection.end()

      responseMessage.statusCode = 200;
      responseMessage.body =  JSON.stringify(releasesResponseObject)

      callback(null, responseMessage);

  } catch (error) {
      console.log(error);
      connection.end()
      responseMessage.statusCode = 400;
      responseMessage.body =  error
      callback(null, responseMessage);
  }  
}

module.exports.createRelease = async (event, context, callback) => {
  const body = JSON.parse(event.body);
  // Validate input parameters
  if (! (
    body && 
    body.backlogId &&
    body.releaseName &&
    body.releaseDescription &&
    body.epicTag
    )) {
      console.log("Invalid path parameters");
      callback(null, {
        statusCode: 200, 
        "headers": {
          "Access-Control-Allow-Origin" : "*",
          "Access-Control-Allow-Credentials" : true
        },
        body: "Error: invalid path parameters"
      });	 
    }

    // Open connection
    const connection = await mysql.createConnection( {
      host: 'eng-metrics.cgwxrjuo6oyd.us-east-1.rds.amazonaws.com',
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: 'eng_metrics'
  });

  // Insert new release
  try {
      const newReleaseInsertStatement = "insert into `release` (uuid, is_active, backlog_id, release_name, release_description, epic_tag, created_dttm) values (" +
        "UUID(), " +
        "True, " +
        body.backlogId + ", " +
        "'" + body.releaseName + "', " +
        "'" + body.releaseDescription + "', " +
        "'" + body.epicTag + "', " +
        "now()" +
        ");";
      const [newReleaseRows, newReleaseFields] = await connection.query(newReleaseInsertStatement);

      const responseMessage = {
          "isBase64Encoded": false,
          "statusCode": 200,
          "headers": {
              "Access-Control-Allow-Origin" : "*",
              "Access-Control-Allow-Credentials" : true
            },
          "body": JSON.stringify({
            message: `Success. Added/updated release: ${body.releaseName}`,
          }),
      }
      connection.end()

      callback(null, responseMessage);

  } catch (error) {
      console.log(error);
      connection.end()
      callback(null, {
          statusCode: 500, 
          body: error
      });	            
  }
}