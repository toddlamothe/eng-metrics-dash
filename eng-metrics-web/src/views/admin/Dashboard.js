import React from "react";
import { useState } from "react";
// javascipt plugin for creating charts
import Chart from "chart.js";
// react plugin used to create charts
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import { useTheme } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Card from "@material-ui/core/Card";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
// core components
import Header from "components/Headers/Header.js";
// hooks
import { useApiRequest } from "hooks/useApiRequest";

import {
  chartOptions,
  parseOptions,
} from "variables/charts.js";

import componentStyles from "assets/theme/views/admin/dashboard.js";

const useStyles = makeStyles(componentStyles);

function Dashboard(props) {
  const backlogUrl = 'https://ha4mv8svsk.execute-api.us-east-1.amazonaws.com/test-tl/backlogs/' + props.backlogId + '/epics';
  const {error, isLoaded, backlogData} = useApiRequest(backlogUrl);

  const classes = useStyles();
  const theme = useTheme();
  const [activeNav, setActiveNav] = useState(1);
  const [chartExample1Data, setChartExample1Data] = useState("data1");
  
  if (window.Chart) {
    parseOptions(Chart, chartOptions());
  }

  const toggleNavs = (index) => {
    setActiveNav(index);
    setChartExample1Data("data" + index);
  };
  return (
    <>
      <Header backlogData={backlogData} />
      <Container maxWidth={false} component={Box} marginTop="-6rem" classes={{ root: classes.containerRoot }}>
        <Grid container spacing={1}>
          <Grid item xs={12} xl={12} component={Box} marginBottom="3rem!important" classes={{ root: classes.gridItemRoot }} >
            <Card classes={{root: classes.cardRoot + " " + classes.cardRootBgGradient,}}>
              <Box component={Typography} variant="h2" marginBottom="0!important">
                <Box component="span" color={theme.palette.white.main}>
                  Epic Stories by Status
                </Box>
              </Box>               
            </Card>
          </Grid>
          <Grid item xs={12} xl={12} component={Box} marginBottom="3rem!important" classes={{ root: classes.gridItemRoot }} >
            <Card classes={{root: classes.cardRoot + " " + classes.cardRootBgGradient,}}>
              <Box component={Typography} variant="h2" marginBottom="0!important">
                <Box component="span" color={theme.palette.white.main}>
                  Velocity
                </Box>
              </Box>               
            </Card>
          </Grid>          
        </Grid>
        <Grid container>
          <Grid item xs={12} xl={8} component={Box} marginBottom="3rem!important" classes={{ root: classes.gridItemRoot }}>
            <Typography variant="h6">2nd ROW</Typography>
          </Grid>          
        </Grid> 
      </Container>
    </>
  );
}

export default Dashboard;