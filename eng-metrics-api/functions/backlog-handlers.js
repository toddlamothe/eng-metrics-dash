module.exports.backlogs = async (event) => {

    fetch('https://unionstmedia.atlassian.net/rest/agile/1.0/board/')
        .then(response => {
            if (!response.ok) {
                const response = {
                    statusCode: response.status,
                    body: JSON.stringify('Error fetching product backlogs')
                };        
                return response;
                    throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json()            
        })
        .then(data => {
            const response = {
                statusCode: 200,
                body: JSON.stringify('Hello from Lambda!')
            };        
            return response;
        });
};
