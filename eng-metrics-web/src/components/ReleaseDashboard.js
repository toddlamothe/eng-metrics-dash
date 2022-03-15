import React from 'react';
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Grid from '@mui/material/Grid';
import {Toolbar, Typography} from '@mui/material';
import MetricCard from "./MetricCard";
import { useApiGet } from '../hooks/useApiGet';
import {formatAsPercent} from "helpers/helpers";

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

  const release = location.state.release;

  return (
    <>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          {release.release_name} - Release Dashboard
        </Typography>
      </Toolbar>
      <Grid container spacing={1}>
        <Grid item xs={2} md={2} lg={2}>
          <MetricCard title="Stories % Complete" value={storiesPercentComplete}></MetricCard>
        </Grid>
        <Grid item xs={2} md={2} lg={2}>
          <MetricCard title="Total User Stories" value={totalStories}></MetricCard>
        </Grid>
        <Grid item xs={2} md={2} lg={2}>
          <MetricCard title="Stories Complete" value={storiesComplete}></MetricCard>
        </Grid>
        <Grid item xs={2} md={2} lg={2}>
          <MetricCard title="Stories In Progress" value={storiesInProgress}></MetricCard>
        </Grid>
        <Grid item xs={2} md={2} lg={2}>
          <MetricCard title="Stories To Do" value={storiesToDo}></MetricCard>
        </Grid>
        <Grid item xs={2} md={2} lg={2}>
          <MetricCard title="Unestimated" value={storiesUnestimated}></MetricCard>
        </Grid>
        <Grid item xs={2} md={2} lg={2}>
          <MetricCard title="Points % Complete" value={pointsPercentComplete}></MetricCard>
        </Grid>
        <Grid item xs={2} md={2} lg={2}>
          <MetricCard title="Total Story Points" value={totalPoints}></MetricCard>
        </Grid>
        <Grid item xs={2} md={2} lg={2}>
          <MetricCard title="Points Complete" value={pointsComplete}></MetricCard>
        </Grid>
        <Grid item xs={2} md={2} lg={2}>
          <MetricCard title="Points In Progress" value={pointsInProgress}></MetricCard>
        </Grid>
        <Grid item xs={2} md={2} lg={2}>
          <MetricCard title="Points To Do" value={pointsToDo}></MetricCard>
        </Grid>
      </Grid>
    </>
  )

};

export default ReleaseDashboard;