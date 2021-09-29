import React from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import { useTheme } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import PieChart from "@material-ui/icons/PieChart";

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
              <Grid item xl={3} lg={6} xs={12}>
                <CardStats
                  subtitle="Stories % Compl."
                  title="X"
                  icon={PieChart}
                  color="bgError"
                />
              </Grid>
              <Grid item xl={2} lg={6} xs={12}>
                <CardStats
                  subtitle="Total Stories"
                  title="X"
                  color="bgWarning"                  
                />
              </Grid>
              <Grid item xl={2} lg={6} xs={12}>
                <CardStats
                  subtitle="Complete"
                  title="924"
                  color="bgWarningLight"
                />
              </Grid>
              <Grid item xl={2} lg={6} xs={12}>
                <CardStats
                  subtitle="In Progress"
                  title="49,65%"
                  color="bgInfo"
                />
              </Grid>
              <Grid item xl={2} lg={6} xs={12}>
                <CardStats
                  subtitle="To Do"
                  title="49,65%"
                  color="bgInfo"
                />
              </Grid>
              <Grid item xl={2} lg={6} xs={12}>
                <CardStats
                  subtitle="Unestimated"
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
