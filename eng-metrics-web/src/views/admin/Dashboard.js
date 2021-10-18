import React from "react";
import { useState } from "react";
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
      <Container maxWidth={false} component={Box} marginTop="-6rem">
        {/* Root grid container for dashboard charts */}
        <Grid container spacing={1}>
          <Grid item xs={12} xl={12} >
            {/* 
              This card fedines a blue box and brings it to the front
              cardRootBgGradient is defined in assets/theme/views/admin/dashboard.js and makes the card blue blue
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
        </Grid>
      </Container>
    </>
  );
}

export default Dashboard;


{/* <Grid container spacing={1}>
<Grid item xs={12} xl={12} component={Box} marginBottom="3rem!important" classes={{ root: classes.gridItemRoot }} >
  <Card classes={{root: classes.cardRoot + " " + classes.cardRootBgGradient,}} >
    <Box component="span" marginBottom="0!important" color={theme.palette.white.main}>
      <HorizontalStackedBar title="Epic Stories by Status" />
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
</Grid>  */}