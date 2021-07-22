import React, {useState, useEffect} from "react";
import Header from "./Header";
import SingleMetricCard from "./SingleMetricCard";
import StackedBarChart from "./StackedBarChart";
import PieChart from "./PieChart";
import Container from 'react-bootstrap/Container';
import {Row, Col, Spinner} from "react-bootstrap";
import {FormatEpicDataForBarChart, stackedBarChartBlankSeries, stackedBarChartBlankOptions, pieChartBlankOptions, pieChartBlankSeries, formatAsPercent, FormatEpicDataForPieChart} from '../js/EngMetricsHelpers';
import {useLocation} from 'react-router-dom';
import queryString from 'query-string';
import '../assets/css/eng-metrics.css';

 function Main(props) {
    var {search} = useLocation();
    // const spinnerStyle = { position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)" };
    const [spinnerVisible, setSpinnerVisible] = useState(true);
    
    const queryStringValues = queryString.parse(search);
    const [backlogId, setBacklogId] = useState(23);
    const [projectName, setProjectName] = useState("Map Search");

    if (queryStringValues.backlogId && (queryStringValues.backlogId !== backlogId)) {
        setBacklogId(queryStringValues.backlogId)
        setProjectName(queryStringValues.project);
    }

    var [rawBacklogEpics, setRawBacklogEpics] = useState('');
    var [stackedBarChartOptionData, setStackedBarChartOptionData] = useState({
        "defaultOptions": stackedBarChartBlankOptions,
        "defaultSeries" : stackedBarChartBlankSeries
    })

    var [pieChartOptionData, setPieChartOptionData] = useState( {
        "options" : pieChartBlankOptions,
        "series" : pieChartBlankSeries
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
            // Pull backlog ID from the querystring
            getBacklogEpics(backlogId || 23);
        }
    }, [backlogId]);

    // When the raw backlog and epic data changes, 
    // format it and make it available to the chart controls
    useEffect( () => {
        if (rawBacklogEpics) {
            var formattedStackedBarChartOptionData =  FormatEpicDataForBarChart(rawBacklogEpics.epics);
            setStackedBarChartOptionData(formattedStackedBarChartOptionData);
            var formattedPieCharOptionData = FormatEpicDataForPieChart(rawBacklogEpics.epics);
            setPieChartOptionData(formattedPieCharOptionData);
            setStoriesPercentComplete(formatAsPercent(rawBacklogEpics.backlogIssuesPercentComplete) + "%");
            setPointsPercentComplete(formatAsPercent(rawBacklogEpics.backlogPointsPercentComplete) + "%");
            setTotalStories(rawBacklogEpics.backlogTotalIssues);
            setStoriesComplete(rawBacklogEpics.backlogIssuesDone);
            setStoriesInProgress(rawBacklogEpics.backlogIssuesInProgress);
            setStoriesToDo(rawBacklogEpics.backlogIssuesToDo);
            setStoriesUnestimated(rawBacklogEpics.backlogIssuesUnestimated);
            setTotalPoints(rawBacklogEpics.backlogTotalPoints);
            setPointsComplete(rawBacklogEpics.backlogPointsDone);
            setPointsinProgress(rawBacklogEpics.backlogPointsInProgress);
            setPointsToDo(rawBacklogEpics.backlogPointsToDo);
        }
    }, [rawBacklogEpics]);

    const getBacklogEpics = async (backlogId) => {
        showSpinner();
        await fetch(
            'https://ausl4ri6y1.execute-api.us-east-1.amazonaws.com/test-tl/backlogs/' + backlogId + '/epics', {
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
                hideSpinner();
                return response.json()            
            })
            .then(data => {
                console.log("data = ", data);
                setRawBacklogEpics(data);
            });
    }

    function showSpinner() {        
        setSpinnerVisible(true);
    }

    function hideSpinner() {        
        setSpinnerVisible(false);
    }

    return(
        <div className="app">
            <div className="spinnerControl">
                {spinnerVisible && <Spinner animation="border" variant="primary" role="status" />}
            </div>
            <Header />
            <div className="alignLeft"><h1>Project Dashboard - {projectName}</h1></div>
            <Container fluid style={{ paddingLeft: 0, paddingRight: 0 }}>
                <Row>
                    <Col md={2} className="noPadding noMargin">
                        <SingleMetricCard size="large" title="Total Stories % Complete" value={storiesPercentComplete} />
                    </Col>
                    <Col md={4} className="noPadding noMargin">
                        
                    </Col>
                    <Col md={2} className="noPadding noMargin">
                        <SingleMetricCard  size="large" title="Total Points % Complete" value={pointsPercentComplete} />
                    </Col>
                    <Col md={4} className="noPadding noMargin">
                        
                    </Col>
                </Row>
                <Row className='mt-2'>
                    <Col md={1} style={{ paddingLeft: 2, paddingRight: 2 }}>
                        <SingleMetricCard title="Total Stories" value={totalStories} />
                    </Col>
                    <Col md={1} style={{ paddingLeft: 2, paddingRight: 2 }}>
                        <SingleMetricCard title="Complete" value={storiesComplete} />
                    </Col>
                    <Col md={1} style={{ paddingLeft: 2, paddingRight: 2 }}>
                        <SingleMetricCard title="In Progress" value={storiesInProgress} />
                    </Col>
                    <Col md={1} style={{ paddingLeft: 2, paddingRight: 2 }}>
                        <SingleMetricCard title="To Do" value={storiesToDo} />
                    </Col>
                    <Col md={1} style={{ paddingLeft: 2, paddingRight: 2 }}>
                        <SingleMetricCard title="Unestimated" value={storiesUnestimated} />
                    </Col>
                    <Col md={1} style={{ paddingLeft: 2, paddingRight: 2 }}></Col>
                    <Col md={1} style={{ paddingLeft: 0, paddingRight: 0 }}>
                        <SingleMetricCard title="Total Points" value={totalPoints} />
                    </Col>
                    <Col md={1} style={{ paddingLeft: 2, paddingRight: 2 }}>
                        <SingleMetricCard title="Complete" value={pointsComplete} />
                    </Col>
                    <Col md={1} style={{ paddingLeft: 2, paddingRight: 2 }}>
                        <SingleMetricCard title="In Progress" value={pointsInProgress} />
                    </Col>
                    <Col md={1} style={{ paddingLeft: 2, paddingRight: 2 }}>
                        <SingleMetricCard title="To Do" value={pointsToDo} />
                    </Col>
                    <Col md={2} style={{ paddingLeft: 2, paddingRight: 2 }}></Col>
                </Row>
                <Row className='mt-3'>
                    <Col md={8}>
                        <StackedBarChart defaultSeries={stackedBarChartOptionData.defaultSeries} defaultOptions={stackedBarChartOptionData.defaultOptions} />
                    </Col>   
                    <Col md={4}>
                        <PieChart options={pieChartOptionData.options} series={pieChartOptionData.series} type="pie" />
                    </Col>                 
                </Row>                
            </Container>
        </div>
    )
}

export default Main;