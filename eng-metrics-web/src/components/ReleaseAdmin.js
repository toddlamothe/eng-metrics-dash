import React from 'react';
import { useState } from "react";
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import ReleaseList from './ReleaseList';
import ReleaseDetails from './ReleaseDetails';
import Button from '@mui/material/Button';

const ReleaseAdmin = (props) => {
  var [releaseDetailComponentVisible, setReleaseDetailComponentVisibile] = useState(false);
  var [releaseDetails, setReleaseDetails] = useState({});

  const onReleaseSelected = (selectedReleaseDetails) => {
    setReleaseDetails(selectedReleaseDetails);
    showReleaseDetailComponent();
  }
  
  const showReleaseDetailComponent = () => {
    setReleaseDetailComponentVisibile(true);
  }

  const onReleaseDetailsCanclled = () => {
    setReleaseDetailComponentVisibile(false);
  }

  const onNewReleaseClicked = () => {
    setReleaseDetails({});
    showReleaseDetailComponent()
  };

  return (
      <>
        <Toolbar>
          <Typography variant="h4" component="div" sx={{ flexGrow: 1 }}>
            Release Admin
          </Typography>  
          <Button color="inherit" onClick={() => { onNewReleaseClicked() }}>New Release</Button>
        </Toolbar>
        <Container maxWidth="lg" sx={{ mt: 1, mb: 1 }}>
          <Grid container spacing={1}>
            {/* List Releases */}
            <Grid item xs={12} md={6} lg={6}>
              <ReleaseList onReleaseSelected={onReleaseSelected} />
            </Grid>
            {/* Release Details */}
            {
              releaseDetailComponentVisible ?  (
                  <Grid item xs={12} md={6} lg={6}>
                    <ReleaseDetails 
                      onReleaseDetailsCanclled={onReleaseDetailsCanclled}
                      visible={releaseDetailComponentVisible} 
                      releaseDetails={releaseDetails}
                    />
                  </Grid>                  
                ) : <div></div>
            }            
          </Grid>
        </Container>
      </>
    )
};

export default ReleaseAdmin;