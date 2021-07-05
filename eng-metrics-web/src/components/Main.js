import React, {useState, useEffect} from "react";
import Header from "./Header";
import SingleMetricCard from "./SimgleMetricCard";
import BarChart from "./BarChart";
import StackedBarChart from "./StackedBarChart";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import {FormatEpicDataForBarChart, blankSeries, blankOptions, formatAsPercent} from '../js/EngMetricsHelpers';

 function Main() {
    var [rawBacklogEpics, setRawBacklogEpics] = useState('');
    var [chartOptionData, setChartOptionData] = useState({
        "defaultOptions": blankOptions,
        "defaultSeries" : blankSeries
    })

    var [storiesPercentComplete, setStoriesPercentComplete] = useState('');
    var [totalStories, setTotalStories] = useState('');
    var [storiesComplete, setStoriesComplete] = useState('');
    var [storiesInProgress, setStoriesInProgress] = useState('');
    var [storiesToDo, setStoriesToDo] = useState('');
    var [storiesUnestimated, setStoriesUnestimated] = useState('');
    var [pointsPercentComplete, setPointsPercentComplete] = useState('');
    var [totalPoints, setTotalPoints] = useState('');
    var [pointsComplete, setPointsComplete] = useState('');
    var [pointsInProgress, setPointsinProgress] = useState('');
    var [pointsToDo, setPointsToDo] = useState('');

    // When the component loads, fetch raw backlog and epic data
    useEffect( () => {
        if (!rawBacklogEpics) {
            getBacklogEpics();
        }
    }, []);

    // When the raw backlog and epic data changes, 
    // format it and make it available to the chart controls
    useEffect( () => {
        if (rawBacklogEpics) {
            var formattedChartOptionData =  FormatEpicDataForBarChart(rawBacklogEpics.epics);
            setChartOptionData(formattedChartOptionData);
            setStoriesPercentComplete(formatAsPercent(rawBacklogEpics.backlogIssuesPercentComplete) + "%");
            setPointsPercentComplete(formatAsPercent(rawBacklogEpics.backlogPointsPercentComplete) + "%");
            setTotalStories(rawBacklogEpics.backlogTotalIssues);
            setStoriesComplete(rawBacklogEpics.backlogIssuesDone);
            setStoriesInProgress(rawBacklogEpics.backlogIssuesInProgress);
            setStoriesToDo(rawBacklogEpics.backlogIssuesToDo);
            // setStoriesUnestimated(rawBacklogEpics.);
            setTotalPoints(rawBacklogEpics.backlogTotalPoints);
            setPointsComplete(rawBacklogEpics.backlogPointsDone);
            setPointsinProgress(rawBacklogEpics.backlogPointsInProgress);
            setPointsToDo(rawBacklogEpics.backlogPointsToDo);
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
                setRawBacklogEpics(data);
            });
    }     

    return(
        <div className="app">
            <Header />
            <Container fluid>
                <Row>
                    <Col md={2}>
                        <SingleMetricCard width="5" title="Total Stories % Complete" value={storiesPercentComplete} />
                    </Col>
                    <Col md={4}>
                        
                    </Col>
                    <Col md={2}>
                        <SingleMetricCard title="Total Points % Complete" value={pointsPercentComplete} />
                    </Col>
                    <Col md={4}>
                        
                    </Col>
                </Row>
                <Row className='mt-2'>
                    <Col md={1} className='ml-0 mr-0'>
                        <SingleMetricCard title="Total Stories" value={totalStories} />
                    </Col>
                    <Col md={1}>
                        <SingleMetricCard title="Complete" value={storiesComplete} />
                    </Col>
                    <Col md={1}>
                        <SingleMetricCard title="In Progress" value={storiesInProgress} />
                    </Col>
                    <Col md={1}>
                        <SingleMetricCard title="To Do" value={storiesToDo} />
                    </Col>
                    <Col md={1}>
                        <SingleMetricCard title="Unestimated" value={storiesUnestimated} />
                    </Col>
                    <Col md={1}>
                        <SingleMetricCard title="" value="" />
                    </Col>
                    <Col md={1}>
                        <SingleMetricCard title="Total Points" value={totalPoints} />
                    </Col>
                    <Col md={1}>
                        <SingleMetricCard title="Complete" value={pointsComplete} />
                    </Col>
                    <Col md={1}>
                        <SingleMetricCard title="In Progress" value={pointsInProgress} />
                    </Col>
                    <Col md={1}>
                        <SingleMetricCard title="To Do" value={pointsToDo} />
                    </Col>
                    <Col md={1}>
                        <SingleMetricCard title="" value="" />
                    </Col>
                    <Col md={1}>
                        
                    </Col>

                </Row>
                <Row className='mt-2'>
                    <Col>
                        <StackedBarChart defaultSeries={chartOptionData.defaultSeries} defaultOptions={chartOptionData.defaultOptions} />
                    </Col>
                    
                </Row>
            </Container>
        </div>
    )
}

export default Main;