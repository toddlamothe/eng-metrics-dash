import React from "react";
import { useState } from "react";
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

import componentStyles from "assets/theme/views/admin/dashboard.js";

import {StackedBar} from "components/Charts/StackedBar.js";

const useStyles = makeStyles(componentStyles);

function Dashboard(props) {
  const backlogUrl = 'https://ha4mv8svsk.execute-api.us-east-1.amazonaws.com/test-tl/backlogs/' + props.backlogId + '/epics';
  const {error, isLoaded, backlogData} = useApiRequest(backlogUrl);

  const classes = useStyles();
  const theme = useTheme();
  const [activeNav, setActiveNav] = useState(1);

  const toggleNavs = (index) => {
    setActiveNav(index);
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
                  <StackedBar></StackedBar>
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