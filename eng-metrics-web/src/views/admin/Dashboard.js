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
import PieChart from "components/Charts/Pie";
import BarLineCombo from "components/Charts/BarLineCombo";
import { genColor } from 'assets/js/helpers';

const useStyles = makeStyles(componentStyles);

function Dashboard(props) {
  const backlogEpicsUrl = 'https://ha4mv8svsk.execute-api.us-east-1.amazonaws.com/test-tl/backlogs/' + props.backlogId + '/epics';
  const backlogData = useApiRequest(backlogEpicsUrl);
  const [epicBarChartData, setEpicBarChartData] = useState({});
  const [epicPieChartData, setEpicPieChartData] = useState({});

  const backlogVelocitiesUrl = 'https://ha4mv8svsk.execute-api.us-east-1.amazonaws.com/test-tl/backlogs/' + props.backlogId + '/velocity';
  const backlogVelocityData = useApiRequest(backlogVelocitiesUrl);
  const [velocityBarChartData, setVelocityBarChartData] = useState({});

  const classes = useStyles();
  const theme = useTheme();

  // useEffect to trigger formatting of velocity data fed to the velocity bar chart
  useEffect( () => {
    console.log("useEffect backlogVelocityData = ", backlogVelocityData);
    var labels = [];
    var datasets = [
      {
        label: 'Points Completed', data: [], backgroundColor: [], borderColor: [], borderWidth: 1,
      },
      {
        label: 'Points Estimated', data: [], type: "line", borderWidth: 1,  
      }
    ];

    backlogVelocityData.forEach( (sprint) => {
      labels.push(sprint.end_date);
      datasets[0].data.push(sprint.total_points);
      datasets[0].backgroundColor.push(genColor());
      datasets[1].data.push(sprint.total_points_estimated);      
    });

    const chartData = {
      labels: labels,
      datasets: datasets
    };   
    
    setVelocityBarChartData(chartData);

  }, [backlogVelocityData]);
  
  // useEffect to trigger formatting of epic data fed to the epic bar chart
  useEffect( () => {
    if (backlogData.epics) {
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
        epicTotalPointValues.push(epic.totalPoints)
      })
      
      // Define blank stacked bar chart data set. each element in the datasets array is a stacked block on each bar
      // The detault data set below defines the label and color for each block in the stack. The values for each block
      // will be filled in by processing the epic data for the given backlog
      let datasets = [
        { label: 'Done', data: doneValues, backgroundColor: 'rgb(75, 192, 192)', },
        { label: 'In Progress', data: inProgressValue, backgroundColor: 'rgb(54, 162, 235)', },
        { label: 'To Do', data: toDoValues, backgroundColor: 'rgb(255, 99, 132)',},
        {label: 'Unestimated', data: unestimatedValues, backgroundColor: 'rgb(100, 100, 100)', },
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
            data: epicTotalPointValues,
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
  }, [backlogData])

  const cardcontent = {
    padding: 0,
    "&:last-child": {
    paddingBottom: 0
    }
  };

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
                <CardContent classes={{ root: classes.removePadding }}>
                  <Box position="relative" >
                    <HorizontalStackedBar data={epicBarChartData} />
                  </Box>
                </CardContent>                
            </Card>
          </Grid>
          <Grid item xs={12} xl={4}>
            <Card classes={{ root: classes.cardRoot + " " + classes.removePadding }}>
              <CardHeader title={
                  <Box component="span" color={theme.palette.gray[600]}>
                    Epics
                  </Box>
                }
                subheader="Story Points" classes={{ root: classes.cardHeaderRoot }}
                titleTypographyProps={{
                  component: Box, variant: "h6", letterSpacing: ".0625rem", marginBottom: ".25rem!important", classes: { root: classes.textUppercase, }, }}
                subheaderTypographyProps={{
                  component: Box, variant: "h2", marginBottom: "0!important", color: "initial",
                }}
              ></CardHeader>
              <CardContent classes={{ root: classes.removePadding }}>
                <Box position="relative" height="350px">
                  <PieChart data={epicPieChartData}></PieChart>
                </Box>
              </CardContent>
            </Card>
          </Grid>          
        </Grid>
        <Grid container spacing={1}>
          <Grid item xs={12} xl={10} >
          <Card classes={{ root: classes.cardRoot + " " + classes.removePadding }}>
              <CardHeader title={
                  <Box component="span" color={theme.palette.gray[600]}>
                    Velocity
                  </Box>
                }
                subheader="Points Per Sprint" classes={{ root: classes.cardHeaderRoot }}
                titleTypographyProps={{
                  component: Box, variant: "h6", letterSpacing: ".0625rem", marginBottom: ".25rem!important", classes: { root: classes.textUppercase, },
                }}
                subheaderTypographyProps={{
                  component: Box, variant: "h2", marginBottom: "0!important", color: "initial",
                }}
              ></CardHeader>
              <CardContent classes={{ root: classes.removePadding }}>
                <Box position="relative">
                  <BarLineCombo data={velocityBarChartData}></BarLineCombo>
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