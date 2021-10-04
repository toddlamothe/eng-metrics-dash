import { useState, useEffect } from "react";

export const useApiRequest = (url) => {
    console.log("[useApiRequest]");
    const [data, setData] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState(null);
  
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
                // console.log("fetch callback")
                // console.log("data = ", data);
                setIsLoaded(true);
                setData(data);
            }).catch(function(error) {
                setError(error);
            });
      };
      fetchData();
    }, [url]);
  
    console.log("returning data...", data);
    return { error, isLoaded, data };
}