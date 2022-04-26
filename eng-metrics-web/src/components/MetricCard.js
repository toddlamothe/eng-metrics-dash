import * as React from 'react';
import makeStyles from '@mui/styles/makeStyles';
import { useTheme } from "@mui/material/styles";
import {Typography, Grid, Paper, Box } from '@mui/material';
import componentStyles from "assets/theme/card-stats";

const useStyles = makeStyles(componentStyles);

function preventDefault(event) {
  event.preventDefault();
}

export default function MetricCard(props) {
  const classes = useStyles();
  const theme = useTheme();
  
  return (
    <React.Fragment>
      <Grid item>
        <Paper
          sx={{
            p: 1,
            display: 'flex',
            flexDirection: 'column',
            height: 70,
            width: 160
          }}
        >
          <Box
            component={Typography}
            height="1rem"
            padding="0px"
            variant="h6"
            color={theme.palette.grey[600] + "!important"}
            marginBottom="0!important"
            marginTop="0!important"
            className={classes.textUppercase}
          >
            {props.title}
          </Box>
          <Box
            component={Typography}
            padding="5px"
            variant="h4"
            fontWeight="500!important"
            marginBottom="0!important"
            marginTop="0!important"
            m="auto"
          >
            {props.value}
          </Box>    
        </Paper>
      </Grid>      
    </React.Fragment>
  );
}