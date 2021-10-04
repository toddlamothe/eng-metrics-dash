import React from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import { useTheme } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
// import PieChart from "@material-ui/icons/PieChart";

// core components
import CardStats from "components/Cards/CardStats.js";

import componentStyles from "assets/theme/components/header.js";

const useStyles = makeStyles(componentStyles);

const Header = () => {
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
                    title="X"
                    color="bgWarning"                  
                  />
                </Grid>                
              <Grid item xl={2} lg={6} xs={12}>
                <CardStats
                  subtitle="Total User Stories"
                  title="X"
                  color="bgWarning"                  
                />
              </Grid>
              <Grid item xl={2} lg={6} xs={12}>
                <CardStats
                  subtitle="Stories Complete"
                  title="924"
                  color="bgWarningLight"
                />
              </Grid>
              <Grid item xl={2} lg={6} xs={12}>
                <CardStats
                  subtitle="Stories In Progress"
                  title="49,65%"
                  color="bgInfo"
                />
              </Grid>
              <Grid item xl={2} lg={6} xs={12}>
                <CardStats
                  subtitle="User Stories To Do"
                  title="49,65%"
                  color="bgInfo"
                />
              </Grid>
              <Grid item xl={2} lg={6} xs={12}>
                <CardStats
                  subtitle="Stories Unestimated"
                  title="49,65%"
                  color="bgInfo"
                />
              </Grid>
              <Grid item xl={2} lg={6} xs={12}>
                  <CardStats
                    subtitle="Points % Complete"
                    title="X"
                    color="bgWarning"                  
                  />
                </Grid>                
              <Grid item xl={2} lg={6} xs={12}>
                <CardStats
                  subtitle="Total Story Points"
                  title="X"
                  color="bgWarning"                  
                />
              </Grid>
              <Grid item xl={2} lg={6} xs={12}>
                <CardStats
                  subtitle="Points Complete"
                  title="924"
                  color="bgWarningLight"
                />
              </Grid>
              <Grid item xl={2} lg={6} xs={12}>
                <CardStats
                  subtitle="Points In Progress"
                  title="49,65%"
                  color="bgInfo"
                />
              </Grid>
              <Grid item xl={2} lg={6} xs={12}>
                <CardStats
                  subtitle="Story Points To Do"
                  title="49,65%"
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
