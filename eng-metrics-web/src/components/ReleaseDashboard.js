import React from 'react';
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Container from "@mui/material/Container";
import Grid from '@mui/material/Grid';
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from '@mui/material/CardHeader';

import {Toolbar, Typography} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import MetricCard from "./MetricCard";
import {HorizontalStackedBar} from './charts/HorizontalStackedBar';
import { useApiGet } from '../hooks/useApiGet';
import {formatAsPercent} from "assets/helpers/helpers";
import componentStyles from "assets/theme/release-dashboard";


const ReleaseDashboard = () => {
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
  var [epicBarChartData, setEpicBarChartData] = useState({});
  var [epicPieChartData, setEpicPieChartData] = useState({});


  let location = useLocation();
  const backlogEpicsUrl = 'https://ha4mv8svsk.execute-api.us-east-1.amazonaws.com/test-tl/backlogs/' + location.state.release.backlog_id + '/epics';
  const backlogData = useApiGet(backlogEpicsUrl);

  const useStyles = makeStyles(componentStyles);

  useEffect( () => {
    if (backlogData.epicCount) {
      setStoriesPercentComplete(formatAsPercent(backlogData.backlogIssuesPercentComplete) + "%");
      setPointsPercentComplete(formatAsPercent(backlogData.backlogPointsPercentComplete) + "%");
      setTotalStories(backlogData.backlogTotalIssues + "");
      setStoriesComplete(backlogData.backlogIssuesDone + "");
      setStoriesInProgress(backlogData.backlogIssuesInProgress + "");
      setStoriesToDo(backlogData.backlogIssuesToDo + "");
      setStoriesUnestimated(backlogData.backlogIssuesUnestimated + "");
      setTotalPoints(backlogData.backlogTotalPoints + "");
      setPointsComplete(backlogData.backlogPointsDone + "");
      setPointsinProgress(backlogData.backlogPointsInProgress + "");
      setPointsToDo(backlogData.backlogPointsToDo + "");

      let labels = backlogData.epics.map( (epic) => {
        return epic.name
      });
      var doneValues = [], inProgressValue = [], toDoValues = [], unestimatedValues = [];
      var epicTotalPointValues = [];
      backlogData.epics.forEach( (epic) => {
        doneValues.push(epic.issuesDone);
        inProgressValue.push(epic.issuesInProgress);
        toDoValues.push(epic.issuesToDo);
        unestimatedValues.push(epic.issuesUnestimated);
        // epicTotalPointValues.push(epic.totalPoints)
      })
      
      // Define blank stacked bar chart data set. each element in the datasets array is a stacked block on each bar
      // The detault data set below defines the label and color for each block in the stack. The values for each block
      // will be filled in by processing the epic data for the given backlog
      let datasets = [
        { label: 'Done', data: doneValues, backgroundColor: 'rgb(75, 192, 192)', },
        { label: 'In Progress', data: inProgressValue, backgroundColor: 'rgb(54, 162, 235)', },
        { label: 'To Do', data: toDoValues, backgroundColor: 'rgb(255, 99, 132)',},
      ];
  
      // Format backlog data for use in the epics bar chart
      let stackedBarChartData = {
        labels: labels,
        datasets: datasets
      };
  
      let pieChartData = {
        labels: labels,
        datasets: [
          {
            label: 'Story Points',
            data: unestimatedValues,
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)','rgba(54, 162, 235, 0.2)','rgba(255, 159, 64, 0.2)','rgba(255, 206, 86, 0.2)','rgba(75, 192, 192, 0.2)','rgba(255, 159, 64, 0.2)','rgba(153, 102, 255, 0.2)','rgba(255, 159, 64, 0.2)','rgba(255, 159, 64, 0.2)',
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)','rgba(54, 162, 235, 1)','rgba(255, 159, 64, 1)','rgba(255, 206, 86, 1)','rgba(75, 192, 192, 1)','rgba(255, 159, 64, 1)','rgba(153, 102, 255, 1)','rgba(255, 159, 64, 1)','rgba(255, 159, 64, 1)',
            ],
            borderWidth: 1,
          },
        ],
      }
  
      setEpicBarChartData(stackedBarChartData);
      setEpicPieChartData(pieChartData);

    }

  }, [backlogData]);

  const classes = useStyles();
  const release = location.state.release;

  return (
    <>

        <Container
            maxWidth={false}
            component={Box}
            classes={{ root: classes.containerRoot }}
        >
          <Toolbar>
            <Typography variant="h4" component="div" sx={{ flexGrow: 1 }}>
              {release.release_name} - Release Dashboard
            </Typography>
          </Toolbar>
          <Grid container spacing={1}>
            <Grid item xs={2} md={2} lg={2}>
              <MetricCard title="Stories % Compl." value={storiesPercentComplete}></MetricCard>
            </Grid>
            <Grid item xs={2} md={2} lg={2}>
              <MetricCard title="Total Stories" value={totalStories}></MetricCard>
            </Grid>
            <Grid item xs={2} md={2} lg={2}>
              <MetricCard title="Stories Done" value={storiesComplete}></MetricCard>
            </Grid>
            <Grid item xs={2} md={2} lg={2}>
              <MetricCard title="Stories In Prog." value={storiesInProgress}></MetricCard>
            </Grid>
            <Grid item xs={2} md={2} lg={2}>
              <MetricCard title="Stories To Do" value={storiesToDo}></MetricCard>
            </Grid>
            <Grid item xs={2} md={2} lg={2}>
              <MetricCard title="Unestimated" value={storiesUnestimated}></MetricCard>
            </Grid>
            <Grid item xs={2} md={2} lg={2}>
              <MetricCard title="Points % Compl." value={pointsPercentComplete}></MetricCard>
            </Grid>
            <Grid item xs={2} md={2} lg={2}>
              <MetricCard title="Total Points" value={totalPoints}></MetricCard>
            </Grid>
            <Grid item xs={2} md={2} lg={2}>
              <MetricCard title="Points Done" value={pointsComplete}></MetricCard>
            </Grid>
            <Grid item xs={2} md={2} lg={2}>
              <MetricCard title="Points In Prog." value={pointsInProgress}></MetricCard>
            </Grid>
            <Grid item xs={2} md={2} lg={2}>
              <MetricCard title="Points To Do" value={pointsToDo}></MetricCard>
            </Grid>
          </Grid>
          <Grid container spacing={1} marginTop=".25rem!important">            
            <Grid item xs={8} md={8} lg={8}>
              <Card classes={{root: classes.cardRoot + " " + classes.cardRootBgGradient,}} >
                <CardHeader subheader={
                      <Grid container component={Box} alignItems="center" justifyContent="space-between">
                        <Grid item xs="auto">
                          <Box component={Typography} variant="h6" letterSpacing=".0625rem" marginBottom=".25rem!important" className={classes.textUppercase} >
                            <Box component="span">
                              Epics
                            </Box>
                          </Box>
                          <Box component={Typography} variant="h4" marginBottom="0!important">
                            <Box component="span">
                              {release.release_name + " - Stories by Status"}
                            </Box>
                          </Box>
                        </Grid>
                      </Grid>
                    }
                    classes={{ root: classes.cardHeaderRoot }}
                  ></CardHeader>
                  <CardContent classes={{ root: classes.removePadding }}>
                    <Box position="relative">
                      <HorizontalStackedBar data={epicBarChartData}></HorizontalStackedBar>
                    </Box>
                  </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>    
    
    </>
  )

};

export default ReleaseDashboard;