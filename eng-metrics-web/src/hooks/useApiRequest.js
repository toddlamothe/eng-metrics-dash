import { useState, useEffect } from "react";

export const useApiRequest = (url) => {
    const [backlogData, setBacklogData] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [backlogError, setBacklogError] = useState(null);
  
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
                setIsLoaded(true);
                setBacklogData(data);
            }).catch(function(error) {
                setBacklogError(error);
            });
      };
      fetchData();
    }, [url]);
  
    return backlogData;
}