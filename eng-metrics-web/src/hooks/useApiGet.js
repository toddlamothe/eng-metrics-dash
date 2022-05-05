import { useState, useEffect } from "react";

export const useApiGet = (url) => {    

  const [apiData, setApiData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {

      await fetch(
        url, {
          method: 'GET',
          mode: 'cors',
          headers: {
            'x-api-key': 'PI9U8B6hNg3Kb80alaGgx4JqzWpd7Sjn14O1234b'
          }
        })
        .then(response => {
          if (!response.ok) {
            const responseMessage = {
                statusCode: response.status,
                body: response.statusText
            };
            return JSON.stringify(responseMessage);
          }
          return response.json()            
        })
        .then(data => {
            setApiData(data);
        }).catch(function(error) {
          const responseMessage = {
            statusCode: 500,
            body: error
          };
          return JSON.stringify(responseMessage);
        });
    };
    fetchData();
  }, [url]);

  return apiData;
}