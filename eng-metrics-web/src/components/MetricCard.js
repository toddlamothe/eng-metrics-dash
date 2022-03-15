import * as React from 'react';
import Link from '@mui/material/Link';
import {Typography, Grid, Paper } from '@mui/material';

function preventDefault(event) {
  event.preventDefault();
}

export default function MetricCard(props) {
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
          <Typography component="h2" variant="h6" gutterBottom>
            {props.title}
          </Typography>
          <Typography component="p" variant="h4">
            {props.value}
          </Typography>
          <Typography color="text.secondary" sx={{ flex: 1 }}>
            {props.subtitle}
          </Typography>       
        </Paper>
      </Grid>      
    </React.Fragment>
  );
}