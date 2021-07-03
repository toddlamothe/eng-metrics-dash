import React, {useState, useEffect} from "react";
import Header from "./Header";
import SingleMetricCard from "./SimgleMetricCard";
import BarChart from "./BarChart";
import StackedBarChart from "./StackedBarChart";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import {FormatEpicDataForBarChart} from '../js/EngMetricsHelpers';

 function Main() {
    var [rawBacklogEpics, setRawBacklogEpics] = useState('');
    var [backlogEpics, setBacklogEpics] = useState('');
    var [chartOptionData, setChartOptionData] = useState({
        "defaultOptions": null,
        "defaultSeries" : null
    })

    // When the component loads, fetch raw backlog and epic data
    useEffect( () => {
        if (!rawBacklogEpics) {
            console.log("about to getBacklogEpics");
            getBacklogEpics();
        }
    }, []);

    // When the raw backlog and epic data changes, 
    // format it and make it available to the chart controls
    useEffect( () => {
        if (rawBacklogEpics) {
            console.log("backlogEpics changed:", rawBacklogEpics);
            console.log("")   
            var formattedChartOptionData =  FormatEpicDataForBarChart(rawBacklogEpics.epics);
            console.log("formattedChartOptionData = ", formattedChartOptionData);
            setChartOptionData(formattedChartOptionData);
        }        
    }, [rawBacklogEpics]);

    const getBacklogEpics = async () => {
        await fetch(
            'https://ausl4ri6y1.execute-api.us-east-1.amazonaws.com/test-tl/backlogs/23/epics', {
            method: 'GET'
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
                // console.log("data = ", data)
                setRawBacklogEpics(data);
            });
    }     

    return(
        <div className="app">
            <Header />
            <Container>
                <Row>
                    <Col>
                        <SingleMetricCard title="Total Stories % Complete" value="55%" />
                    </Col>                    
                </Row>
                <Row>
                    <Col>
                        <SingleMetricCard title="Total Stories" value="12234" />
                    </Col>                    
                </Row>
                <Row>
                    <Col>
                        <StackedBarChart defaultSeries={chartOptionData.defaultSeries} defaultOptions={chartOptionData.defaultOptions} />
                    </Col>
                    
                </Row>
            </Container>
        </div>
    )
}

export default Main;