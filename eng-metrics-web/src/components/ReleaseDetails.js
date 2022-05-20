import React from 'react';
import { useState, useEffect } from "react";
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";

const ReleaseDetails = (props) => {
  const [releaseUuid, setReleaseUuid] = useState(props.releaseDetails.id);
  const [backlogId, setBacklogId] = useState(props.releaseDetails ? props.releaseDetails.backlog_id : props.releaseDetails.backlog_id);
  const [backlogIdError, setBacklogIdError] = useState(false);
  const [releaseName, setReleaseName] = useState(props.releaseDetails ? props.releaseDetails.release_name : props.releaseDetails.release_name);
  const [releaseNameError, setReleaseNameError] = useState(false);
  const [releaseDescription, setReleaseDescription] = useState(props.releaseDetails ? props.releaseDetails.release_description : props.releaseDetails.release_description);
  const [releaseDescriptionError, setReleaseDescriptionError] = useState(false);
  const [epicTag, setEpicTag] = useState(props.releaseDetails.epic_tag);
  const [epicTagError, setEpicTagError] = useState(false);
  const [releaseStartDate, setReleaseStartDate] = useState();
  const [releaseStartDateError, setReleaseStartDateError] = useState();

  // Update component state if props change
  useEffect(() => {
    setReleaseUuid(props.releaseDetails.id ? props.releaseDetails.id : "");
    setBacklogId(props.releaseDetails.backlog_id ? props.releaseDetails.backlog_id : "");
    setReleaseName(props.releaseDetails.release_name ? props.releaseDetails.release_name : "");
    setReleaseDescription(props.releaseDetails.release_description ? props.releaseDetails.release_description : "");
    setEpicTag(props.releaseDetails.epic_tag ? props.releaseDetails.epic_tag : "");


    if (props.releaseDetails && props.releaseDetails.start_date) {
      var startDate = moment(props.releaseDetails.start_date, "YYYY-MM-DD");
      setReleaseStartDate(startDate.toDate());
    }
  }, 
  [props.releaseDetails]);

  // Valdiate release detail form fields
  const validateReleaseDetailsForm = () => {
    if (!(!isNaN(parseFloat(backlogId)) && isFinite(backlogId))) {
      setBacklogIdError(true);
    }
    else {
      setBacklogIdError(false);
    }

    if (!releaseName || releaseName==="") {
      setReleaseNameError(true);
    }
    else {
      setReleaseNameError(false);
    }

    if(!releaseDescription || releaseDescription==="") {
      setReleaseDescriptionError(true);
    }
    else {
      setReleaseDescriptionError(false);
    }

    if(!epicTag || epicTag==="") {
      setEpicTagError(true);
    }
    else {
      setEpicTagError(false);
    }

    if (backlogIdError || releaseNameError || releaseDescriptionError || epicTagError) {
      return false;
    } else {
      return true;
    }
  }

  const onSaveRelease = async () => {
    if (!validateReleaseDetailsForm()) {
      return;
    }      
    const requestBody = {
      "releaseId" : releaseUuid,
      "backlogId": backlogId,
      "releaseName": releaseName,
      "releaseDescription": releaseDescription,
      "epicTag": epicTag,
      "releaseStartDate" : releaseStartDate,
    }
    console.log("requestBody = ", requestBody);
    const requestOptions = {
      method: 'PUT',
      mode: 'cors',
      headers: { 
        'x-api-key': 'PI9U8B6hNg3Kb80alaGgx4JqzWpd7Sjn14O1234b',
      },
      body: JSON.stringify(requestBody)
    };
    const putReleaseUrl = "https://ha4mv8svsk.execute-api.us-east-1.amazonaws.com/test-tl/releases";
    await fetch(
      putReleaseUrl, 
      requestOptions
      )
      .then( response => {
          if (!response.ok) {
            const responseMessage = {
                statusCode: response.status,
                body: response.statusText
            };
            return JSON.stringify(responseMessage);
          }
          return response.json()            
        }
      )
      .then( data => {
        props.onReleaseDetailsSaved();
      })
      .catch(function(error) {
        const responseMessage = {
          statusCode: 500,
          body: error
        };
        // TO DO: Why return the response message on a PUT?
        return JSON.stringify(responseMessage);
      });        
  }

  if (props.visible) {
    return (
      <>
        {/* Release Details */}
        <Container maxWidth="lg">
          <Paper sx={{p: 2, display: 'flex', flexDirection: 'column', }} >
            <Grid container spacing={3}>
              <Grid item xs={12} md={12} lg={12}>
                <TextField 
                  id="backlog-id"
                  label="Backlog Id"
                  value={backlogId}
                  error={backlogIdError}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  placeholder="Enter Backlog ID"
                  helperText="Enter the unique ID for the Jira backlog"
                  fullWidth
                  margin="normal"
                  onChange={(event) => { 
                      const value = event.target.value;
                      setBacklogId(value)
                    }
                  }
                />
              </Grid>
  
              <Grid item xs={12} md={12} lg={12}>
                <TextField 
                    id="release-name"
                    label="Release Name"
                    value={releaseName}
                    error={releaseNameError}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    placeholder="Enter Release Name"
                    helperText="Enter a name for the release"
                    fullWidth
                    margin="normal"
                    onChange={(event) => { 
                      const value = event.target.value;
                      setReleaseName(value)
                      }
                    }
                />
              </Grid>
  
              <Grid item xs={12} md={12} lg={12}>
                <TextField 
                  id="release-description"
                  label="Release Description"
                  value={releaseDescription}
                  error={releaseDescriptionError}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  placeholder="Enter Release Description"
                  helperText="Enter a short description for the release"
                  fullWidth
                  margin="normal"
                  onChange={(event) => { 
                    const value = event.target.value;
                    setReleaseDescription(value)
                    }
                  }
                />
              </Grid>
  
              <Grid item xs={12} md={12} lg={12}>
                <TextField 
                  id="epic-tag"
                  label="Epic Tag"
                  value={epicTag}
                  error={epicTagError}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  placeholder="Enter tag"
                  helperText="Epics marked with the specified tag will be tracked for the release"
                  fullWidth
                  margin="normal"
                  onChange={(event) => { 
                    const value = event.target.value;
                    setEpicTag(value)
                    }
                  }

                />
              </Grid>

              <Grid item xs={12} md={12} lg={12}>
                <DatePicker selected={releaseStartDate} onChange={(date) => setReleaseStartDate(date)} />
              </Grid>

              <Grid item xs={12} md={12} lg={12}>
                <Button color="inherit" onClick={() => { onSaveRelease() }}>Save</Button>
                <Button color="inherit" onClick={() => { props.onReleaseDetailsCanclled() }}>Cancel</Button>
              </Grid>
  
            </Grid>
          </Paper>
        </Container>
      </>
    )
  } else {
    return (
      <></>
    )
  }
};

export default ReleaseDetails;