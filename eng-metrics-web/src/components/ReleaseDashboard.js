import React from 'react';
import {  useLocation, } from "react-router-dom";
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import {Toolbar, Typography} from '@mui/material';

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
        <Container maxWidth="lg" sx={{ mt: 1, mb: 1 }}>
          <Grid container spacing={1}>
            {/* List Releases */}
            <Grid item xs={12} md={6} lg={6}>
            </Grid>
            {/* Release Details */}           
          </Grid>
        </Container>
      </>
    )
  }
};

export default ReleaseDashboard;