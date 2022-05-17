import React from 'react';
import { useState, useEffect } from "react";
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import ReleaseList from './ReleaseList';
import ReleaseDetails from './ReleaseDetails';
import Button from '@mui/material/Button';

const  ReleaseAdmin = (props) => {
  var [releaseDetailComponentVisible, setReleaseDetailComponentVisibile] = useState(false);
  var [releaseDetails, setReleaseDetails] = useState({});

  var [releases, setReleases] = useState();
  
  useEffect( () => {
    setReleases(props.releases);
  }, [props.releases])

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

  const onReleaseDetailsSaved = async () => {
    props.onRefreshReleases();
  }

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
              <ReleaseList onReleaseSelected={onReleaseSelected} releases={releases} />
            </Grid>
            {/* Release Details */}
            {
              releaseDetailComponentVisible ?  (
                  <Grid item xs={12} md={6} lg={6}>
                    <ReleaseDetails 
                      onReleaseDetailsCanclled={onReleaseDetailsCanclled}
                      onReleaseDetailsSaved={onReleaseDetailsSaved}
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