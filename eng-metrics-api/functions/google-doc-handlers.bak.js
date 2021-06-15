'use strict';

const fetch = require('node-fetch');
const { GoogleSpreadsheet } = require('google-spreadsheet');
const doc = new GoogleSpreadsheet(process.env.SPREADSHEET_ID);

module.exports._exportBacklogEpicsToGoogleSheet = (event, context, callback) => {
    if (!event.backlogId) {
        const responseMessage = {
            statusCode: 500,
            body: "Backlog ID not provided"
        };
        callback(JSON.stringify(responseMessage));
    }

    const backlogApiUrl = process.env.GW_URL + '/backlogs/' + event.backlogId + '/epics';
    console.log("backlogApiUrl = ", backlogApiUrl);
    // Fetch specified backlog and epics
    fetch(
        backlogApiUrl , {
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
            console.log("data = ", data);
            // const responseBody = {
            //     boardCount: data.total,
            //     boards: data.values
            // }

            // const responseMessage = {
            //     "isBase64Encoded": false,
            //     "statusCode": 200,
            //     "headers": {
            //     },
            //     "body": JSON.stringify(responseBody)
            // }            
            // callback(null, responseMessage);
        }).catch((error) => {
            callback(Error(error));
        });   
}

module.exports.exportBacklogEpicsToGoogleSheet = async event => {
    console.log('Starting write function');
  
    if(!event.body) {
      return formatResponse(400, { message: 'body is missing' });
    }
    const body = JSON.parse(event.body);
  
    if(!body.cells || !Array.isArray(body.cells)) {
      return formatResponse(400, { message: '"cells" should be an array' })
    }
  
    // load up everything that's necessary to work with cells
    await spreadsheetAuth(doc);
    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[0];
    await sheet.loadCells();
    for(const { identifier, content } of body.cells) {
      const cell = sheet.getCellByA1(identifier);
      cell.value = content;
    }
    await sheet.saveUpdatedCells();
    return formatResponse(200, { message: 'Cells saved successfully'});
  };

function spreadsheetAuth(document) {
    return document.useServiceAccountAuth({
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/gm, '\n'),
    });
  }

function formatResponse(statusCode, payload) {
  return {
    statusCode: statusCode,
    body: JSON.stringify(
      payload,
      null,
      2
    ),
  };
}  

// var mockBody = {
//   "cells" : [1,2,3,4,5]
// }
// var mockEvent = {
//   "body": JSON.stringify(mockBody)
// }
// console.log("mockEvent:")
// console.log(mockEvent)
// module.exports.exportBacklogEpicsToGoogleSheet(mockEvent, null, () => console.log("callback ;)"));