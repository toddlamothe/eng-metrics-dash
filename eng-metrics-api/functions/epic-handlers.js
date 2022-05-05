const fetch = require('node-fetch');

// Return a list of issues (stories) for the specified epic
module.exports.epicStories = async (event, context, callback) => {
  console.log("[epicStories]");
  if (! (event.pathParameters && event.pathParameters.epicId)) {
    console.log("error: epicId not provided. event.pathParameters:  ", event.pathParameters)
    return;
  }

  const atlassianEpicIssuesUri = "https://unionstmedia.atlassian.net/rest/agile/1.0/epic/" + event.pathParameters.epicId + "/issue";
  console.log("atlassianEpicIssuesUri = ", atlassianEpicIssuesUri);

  try {
    await fetch(
      atlassianEpicIssuesUri, {
      method: 'GET',
      headers: {
        Authorization: process.env.ATLASSIAN_API_KEY,
      }
    })
    .then(response => {
      return response.json()            
    })
    .then(data => {
      console.log("data = ", data);

      const responseMessage = {
        "isBase64Encoded": false,
        "statusCode": 200,
        "headers": {
            "Access-Control-Allow-Origin" : "*",
            "Access-Control-Allow-Credentials" : "true"
        },
        "body": JSON.stringify(data)
      }
      callback(null, responseMessage);

    });    
  } catch (error) {
    console.log(error);
  }

}

// const event = {
//   pathParameters: {
//     epicId: "IF-87"
//   }
// }

// module.exports.epicStories(event, null, (response) => console.log(response));