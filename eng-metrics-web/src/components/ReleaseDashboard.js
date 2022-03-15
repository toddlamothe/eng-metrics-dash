import React from 'react';
import {  useLocation, } from "react-router-dom";
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import {Toolbar, Typography} from '@mui/material';
import MetricCard from "./MetricCard";

const ReleaseDashboard = (props) => {
  let location = useLocation();
  if (!(location && location.state && location.state.release)) {
    return (
      <></>
    )
  }
  else {
    const release = location.state.release;
    return (
      <>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {release.release_name} - Release Dashboard
          </Typography>
        </Toolbar>
        <Grid container spacing={1}>
          <Grid item xs={2} md={2} lg={2}>
            <MetricCard title="sample metric" value="$123.45"></MetricCard>
          </Grid>
          <Grid item xs={2} md={2} lg={2}>
            <MetricCard title="sample metric" value="$123.45"></MetricCard>
          </Grid>
          <Grid item xs={2} md={2} lg={2}>
            <MetricCard title="sample metric" value="$123.45"></MetricCard>
          </Grid>
          <Grid item xs={2} md={2} lg={2}>
            <MetricCard title="sample metric" value="$123.45"></MetricCard>
          </Grid>
          <Grid item xs={2} md={2} lg={2}>
            <MetricCard title="sample metric" value="$123.45"></MetricCard>
          </Grid>
          <Grid item xs={2} md={2} lg={2}>
            <MetricCard title="sample metric" value="$123.45"></MetricCard>
          </Grid>
          <Grid item xs={2} md={2} lg={2}>
            <MetricCard title="sample metric" value="$123.45"></MetricCard>
          </Grid>
          <Grid item xs={2} md={2} lg={2}>
            <MetricCard title="sample metric" value="$123.45"></MetricCard>
          </Grid>
          <Grid item xs={2} md={2} lg={2}>
            <MetricCard title="sample metric" value="$123.45"></MetricCard>
          </Grid>
          <Grid item xs={2} md={2} lg={2}>
            <MetricCard title="sample metric" value="$123.45"></MetricCard>
          </Grid>
          <Grid item xs={2} md={2} lg={2}>
            <MetricCard title="sample metric" value="$123.45"></MetricCard>
          </Grid>
        </Grid>
      </>
    )
  }
};

export default ReleaseDashboard;