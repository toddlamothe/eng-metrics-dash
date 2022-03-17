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
      <Grid item xs={12} md={4} lg={3}>
        <Paper
          sx={{
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            height: 150,
            width: 180
          }}
        >
          <Box
            component={Typography}
            variant="h7"
            color={theme.palette.grey[600] + "!important"}
            marginBottom="0!important"
            marginTop="0!important"
            className={classes.textUppercase}
          >
            {props.title}
          </Box>
          <Box
            component={Typography}
            variant="h5"
            fontWeight="600!important"
            marginBottom="0!important"
            marginTop="0!important"
          >
            {props.value}
          </Box>    
        </Paper>
      </Grid>      
    </React.Fragment>
  );
}