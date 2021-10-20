import React from "react";
import { useEffect, useState } from "react";
import { useApiRequest } from "hooks/useApiRequest";
import { makeStyles } from "@material-ui/core/styles";
import { useTheme } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import CardHeader from "@material-ui/core/CardHeader";
import Header from "components/Headers/Header.js";
import componentStyles from "assets/theme/views/admin/dashboard.js";
import HorizontalStackedBar from "components/Charts/HorizontalStackedBar";

const useStyles = makeStyles(componentStyles);

function Dashboard(props) {
  const backlogEpicsUrl = 'https://ha4mv8svsk.execute-api.us-east-1.amazonaws.com/test-tl/backlogs/' + props.backlogId + '/epics';
  const {error, isLoaded, backlogData} = useApiRequest(backlogEpicsUrl);
  const [epicBarChartData, setEpicBarChartData] = useState({});

  const classes = useStyles();
  const theme = useTheme();

  // useEffect to trigger formatting of epic data fed to the epic bar chart
  useEffect( () => {
    if (backlogData.epics) {
      console.log("backlogData.epics = ", backlogData.epics);
      let labels = backlogData.epics.map( (epic) => {
        return epic.name
      });
      var doneValues = [], inProgressValue = [], toDoValues = [], unestimatedValues = [];
      backlogData.epics.forEach( (epic) => {
        doneValues.push(epic.issuesDone);
        inProgressValue.push(epic.issuesInProgress);
        toDoValues.push(epic.issuesToDo);
        unestimatedValues.push(epic.issuesUnestimated);
      })
      console.log("doneValues = ", doneValues);
      console.log("inProgressValue = ", inProgressValue);
      console.log("toDoValues = ", toDoValues);
      console.log("unestimatedValues = ", unestimatedValues);
      
      // Define blank stacked bar chart data set. each element in the datasets array is a stacked block on each bar
      // The detault data set below defines the label and color for each block in the stack. The values for each block
      // will be filled in by processing the epic data for the given backlog
      let datasets = [
        { label: 'Done', data: doneValues, backgroundColor: 'rgb(255, 99, 132)', },
        { label: 'In Progress', data: inProgressValue, backgroundColor: 'rgb(54, 162, 235)', },
        { label: 'To Do', data: toDoValues, backgroundColor: 'rgb(75, 192, 192)',},
        {label: 'Unestimated', data: unestimatedValues, backgroundColor: 'rgb(100, 100, 100)', },
      ];

      // Format backlog data for use in the epics bar chart
      let data = {
        labels: labels,
        datasets: datasets
      };

      setEpicBarChartData(data);
    }   
    
  }, [backlogData])

  return (
    <>
      <Header backlogData={backlogData} />
      <Container maxWidth={false} component={Box} marginTop="-6rem">
        {/* Root grid container for dashboard charts */}
        <Grid container spacing={1}>
          <Grid item xs={12} xl={8} >
            {/* 
              This card fedines a blue box and brings it to the front
              cardRootBgGradient is defined in assets/theme/views/admin/dashboard.js and makes the card blue blue

              <Card classes={{root: classes.cardRoot + " " + classes.cardRootBgGradient,}} >
             */}
            <Card classes={{root: classes.cardRoot + " " + classes.cardRootBgGradient,}} >
              <CardHeader subheader={
                    <Grid container component={Box} alignItems="center" justifyContent="space-between">
                      <Grid item xs="auto">
                        <Box component={Typography} variant="h6" letterSpacing=".0625rem" marginBottom=".25rem!important" className={classes.textUppercase} >
                          <Box component="span" color={theme.palette.gray[400]}>
                            Epics
                          </Box>
                        </Box>
                        <Box component={Typography} variant="h2" marginBottom="0!important">
                          <Box component="span" color={theme.palette.white.main}>
                            Stories by Status
                          </Box>
                        </Box>
                      </Grid>                    
                    </Grid>
                  }
                  classes={{ root: classes.cardHeaderRoot }}
                ></CardHeader>
                <CardContent>
                  <Box position="relative" >
                    <HorizontalStackedBar data={epicBarChartData} />
                  </Box>
                </CardContent>                
            </Card>
          </Grid>
          <Grid item xs={12} xl={4}>
            <Card classes={{ root: classes.cardRoot }}>
              <CardHeader title={
                  <Box component="span" color={theme.palette.gray[600]}>
                    Epics
                  </Box>
                }
                subheader="Total Story Points" classes={{ root: classes.cardHeaderRoot }}
                titleTypographyProps={{
                  component: Box,
                  variant: "h6",
                  letterSpacing: ".0625rem",
                  marginBottom: ".25rem!important",
                  classes: {
                    root: classes.textUppercase,
                  },
                }}
                subheaderTypographyProps={{
                  component: Box,
                  variant: "h2",
                  marginBottom: "0!important",
                  color: "initial",
                }}
              ></CardHeader>
              <CardContent>
                <Box position="relative" height="350px">
                  PIE CHART
                </Box>
              </CardContent>
            </Card>
          </Grid>          
        </Grid>
      </Container>
    </>
  );
}

export default Dashboard;