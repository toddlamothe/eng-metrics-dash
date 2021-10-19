import React from "react";
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

  const classes = useStyles();
  const theme = useTheme();

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
                    <HorizontalStackedBar />
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
                  <HorizontalStackedBar />
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