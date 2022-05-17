import React from 'react';
import { useState, useEffect } from "react";
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import ReleaseList from './ReleaseList';
import ReleaseDetails from './ReleaseDetails';
import Button from '@mui/material/Button';
import { useApiGet } from '../hooks/useApiGet';

const  ReleaseAdmin = (props) => {
  var [releaseDetailComponentVisible, setReleaseDetailComponentVisibile] = useState(false);
  var [releaseDetails, setReleaseDetails] = useState({});

  const releasesUrl = "https://ha4mv8svsk.execute-api.us-east-1.amazonaws.com/test-tl/releases";
  var releaseData;
  var [releases, setReleases] = useState();
  releaseData =  useApiGet(releasesUrl);

  useEffect( () => {
    console.log("useEffect");
    setReleases(releaseData);
  }, [releaseData])

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
    console.log("[OnReleaseDetailsSaved]");
    // Somehow re-render ReleaseList component
    console.log("releasesUrl: ", releasesUrl);
    releaseData =  await fetch(
      releasesUrl, {
        method: 'GET',
        mode: 'cors',
        headers: {
          'x-api-key': 'PI9U8B6hNg3Kb80alaGgx4JqzWpd7Sjn14O1234b'
        }
      })
      .then(response => {
        if (!response.ok) {
          const responseMessage = {
              statusCode: response.status,
              body: response.statusText
          };
          return JSON.stringify(responseMessage);
        }
        return response.json()            
      })
      .then(data => {
          return(data);
      }).catch(function(error) {
        const responseMessage = {
          statusCode: 500,
          body: error
        };
        return JSON.stringify(responseMessage);
      });
    console.log("releaseData = ", releaseData);
    setReleases(releaseData);
  }

  const fetchData = async () => {

    await fetch(
      releasesUrl, {
        method: 'GET',
        mode: 'cors',
        headers: {
          'x-api-key': 'PI9U8B6hNg3Kb80alaGgx4JqzWpd7Sjn14O1234b'
        }
      })
      .then(response => {
        if (!response.ok) {
          const responseMessage = {
              statusCode: response.status,
              body: response.statusText
          };
          return JSON.stringify(responseMessage);
        }
        return response.json()            
      })
      .then(data => {
          return(data);
      }).catch(function(error) {
        const responseMessage = {
          statusCode: 500,
          body: error
        };
        return JSON.stringify(responseMessage);
      });
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