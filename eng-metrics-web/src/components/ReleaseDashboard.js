import React from 'react';
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Container from "@mui/material/Container";
import Grid from '@mui/material/Grid';
import Box from "@mui/material/Box";
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
    }
  }, [backlogData]);

  const classes = useStyles();
  const release = location.state.release;

  return (
    <>
      <div className={classes.header}>
        <Container
            maxWidth={false}
            component={Box}
            classes={{ root: classes.containerRoot }}
        >
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
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
              <MetricCard title="Stories Complete" value={storiesComplete}></MetricCard>
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
              <MetricCard title="Points Complete" value={pointsComplete}></MetricCard>
            </Grid>
            <Grid item xs={2} md={2} lg={2}>
              <MetricCard title="Points In Prog." value={pointsInProgress}></MetricCard>
            </Grid>
            <Grid item xs={2} md={2} lg={2}>
              <MetricCard title="Points To Do" value={pointsToDo}></MetricCard>
            </Grid>
          </Grid>
          <Grid container spacing={1}>            
            <Grid item xs={8} md={8} lg={8}>
              <HorizontalStackedBar></HorizontalStackedBar>
            </Grid>
          </Grid>
        </Container>    
      </div>      
    </>
  )

};

export default ReleaseDashboard;