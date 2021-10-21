import React from "react";
import { useState, useEffect } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import { useTheme } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import {formatAsPercent} from "assets/js/helpers.js";

// core components
import CardStats from "components/Cards/CardStats.js";

import componentStyles from "assets/theme/components/header.js";

const useStyles = makeStyles(componentStyles);

const Header = (props) => {
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

  useEffect( () => {
    if (props.backlogData.epicCount) {
      setStoriesPercentComplete(formatAsPercent(props.backlogData.backlogIssuesPercentComplete) + "%");
      setPointsPercentComplete(formatAsPercent(props.backlogData.backlogPointsPercentComplete) + "%");
      setTotalStories(props.backlogData.backlogTotalIssues + "");
      setStoriesComplete(props.backlogData.backlogIssuesDone + "");
      setStoriesInProgress(props.backlogData.backlogIssuesInProgress + "");
      setStoriesToDo(props.backlogData.backlogIssuesToDo + "");
      setStoriesUnestimated(props.backlogData.backlogIssuesUnestimated + "");
      setTotalPoints(props.backlogData.backlogTotalPoints + "");
      setPointsComplete(props.backlogData.backlogPointsDone + "");
      setPointsinProgress(props.backlogData.backlogPointsInProgress + "");
      setPointsToDo(props.backlogData.backlogPointsToDo + "");
    }
}, [props.backlogData]);
  const classes = useStyles();
  const theme = useTheme();
  return (
    <>
      <div className={classes.header}>
        <Container
          maxWidth={false}
          component={Box}
          classes={{ root: classes.containerRoot }}
        >
          <div>
            <Grid container>    
              <Grid item xl={2} lg={6} xs={12}>
                  <CardStats
                    subtitle="Stories % Complete"
                    title={storiesPercentComplete} 
                    color="bgWarning"                  
                  />
                </Grid>                
              <Grid item xl={2} lg={6} xs={12}>
                <CardStats
                  subtitle="Total User Stories"
                  title={totalStories}
                  color="bgWarning"                  
                />
              </Grid>
              <Grid item xl={2} lg={6} xs={12}>
                <CardStats
                  subtitle="Stories Complete"
                  title={storiesComplete}
                  color="bgWarningLight"
                />
              </Grid>
              <Grid item xl={2} lg={6} xs={12}>
                <CardStats
                  subtitle="Stories In Progress"
                  title={storiesInProgress}
                  color="bgInfo"
                />
              </Grid>
              <Grid item xl={2} lg={6} xs={12}>
                <CardStats
                  subtitle="User Stories To Do"
                  title={storiesToDo}
                  color="bgInfo"
                />
              </Grid>
              <Grid item xl={2} lg={6} xs={12}>
                <CardStats
                  subtitle="Stories Unestimated"
                  title={storiesUnestimated}
                  color="bgInfo"
                />
              </Grid>
              <Grid item xl={2} lg={6} xs={12}>
                  <CardStats
                    subtitle="Points % Complete"
                    title={pointsPercentComplete}
                    color="bgWarning"                  
                  />
                </Grid>                
              <Grid item xl={2} lg={6} xs={12}>
                <CardStats
                  subtitle="Total Story Points"
                  title={totalPoints}
                  color="bgWarning"                  
                />
              </Grid>
              <Grid item xl={2} lg={6} xs={12}>
                <CardStats
                  subtitle="Points Complete"
                  title={pointsComplete}
                  color="bgWarningLight"
                />
              </Grid>
              <Grid item xl={2} lg={6} xs={12}>
                <CardStats
                  subtitle="Points In Progress"
                  title={pointsInProgress}
                  color="bgInfo"
                />
              </Grid>
              <Grid item xl={2} lg={6} xs={12}>
                <CardStats
                  subtitle="Story Points To Do"
                  title={pointsToDo}
                  color="bgInfo"
                />
              </Grid>


            </Grid>
          </div>
        </Container>
      </div>
    </>
  );
};

export default Header;
